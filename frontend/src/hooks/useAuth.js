import { useUser } from '~/context/AuthContext'

export const useAuth = () => {
  const { user, loading, logout } = useUser() || {}
  return {
    user,
    loading,
    logout,
    isAuthenticated: Boolean(user),
  }
}
