import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { parseJwt } from '~/utils/jwt'

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('jwt', token)
      const payload = parseJwt(token)
      setUser(payload)
      navigate('/', { replace: true })
      setLoading(false)
      return
    }

    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      const payload = parseJwt(jwt)
      if (Date.now() < payload.exp * 1000) {
        setUser(payload)
      } else {
        localStorage.removeItem('jwt')
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('jwt')
    setUser(null)
    navigate('/')
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
