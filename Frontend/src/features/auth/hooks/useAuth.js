import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data && data.token && data.user) {
                localStorage.setItem("token", data.token)
                setUser(data.user)
                return true
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        return false
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data && data.token && data.user) {
                localStorage.setItem("token", data.token)
                setUser(data.user)
                return true
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        return false
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
        } catch (err) {
            console.error(err)
        } finally {
            localStorage.removeItem("token")
            setUser(null)
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                } else {
                    localStorage.removeItem("token")
                    setUser(null)
                }
            } catch (err) {
                localStorage.removeItem("token")
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}