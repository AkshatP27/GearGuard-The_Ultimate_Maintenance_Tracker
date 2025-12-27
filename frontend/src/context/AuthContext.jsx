import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'demo@gearguard.com',
  password: 'demo123'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demoUser')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      localStorage.removeItem('demoUser')
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    // Check for demo login
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const demoUser = {
        id: 'demo-user-id',
        email: DEMO_CREDENTIALS.email,
        user_metadata: {
          full_name: 'Demo User',
          role: 'admin'
        },
        isDemoUser: true
      }
      setUser(demoUser)
      localStorage.setItem('demoUser', JSON.stringify(demoUser))
      return { user: demoUser }
    }

    // Regular Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    // Check if demo user
    if (user?.isDemoUser) {
      localStorage.removeItem('demoUser')
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
