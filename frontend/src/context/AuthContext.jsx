import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    // Regular Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      // Custom error messages based on error type
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Account not exist')
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address')
      }
      throw new Error(error.message)
    }
    
    return data
  }

  const signUp = async (email, password, metadata = {}) => {
    // Check if email already exists by attempting to get user
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      throw new Error('Email ID should not be a duplicate in database')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Email ID should not be a duplicate in database')
      }
      throw new Error(error.message)
    }
    
    // Insert user profile into profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: metadata.full_name || '',
            role: metadata.role || 'technician',
            avatar_url: null
          }
        ])
      
      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Don't throw error here - user is created in auth, profile can be added later
      }
    }
    
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
