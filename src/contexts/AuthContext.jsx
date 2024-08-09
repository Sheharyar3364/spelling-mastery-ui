import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext()

export default AuthContext;

const BASE_URL = import.meta.env.VITE_API_URL


export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
    let [user, setUser] = useState(() => localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState(false)
    const [gameLevel, setGameLevel] = useState(() => localStorage.getItem("gameLevel") ? JSON.parse(localStorage.getItem("gameLevel")) : 1)

    let login = async (event) => {
        event.preventDefault()
        let response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'email': event.target.email.value, 'password': event.target.password.value})
        })
        
        let data = await response.json()
        console.log(data)
        
        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("")
        }
        
    }

    const logout = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        localStorage.removeItem("gameLevel")
        navigate("/login")
    }

    let updateToken = async () => {
        let response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })

        const data = await response.json()

        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logout()
        }
        if(loading) {
            setLoading(false)
        }
    }

    let updateLevel = async (newLevel) => {
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"))
        let response = await fetch(`${BASE_URL}/api/updateLevel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
            },
            body: JSON.stringify({ level: newLevel })
        })

        const data = await response.json()
        if(response.status == 200) {
            setGameLevel(data.level)
            localStorage.setItem("gameLevel", JSON.stringify(data.level))
        }
    }

    const getUserLevel = async () => {
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"))
        let response = await fetch(`${BASE_URL}/api/custom-data/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "refresh": authTokensInLocalStorage?.refresh })
        })

        const data = await response.json()
        if(response.status == 200) {
            setGameLevel(data.level)
            localStorage.setItem("gameLevel", JSON.stringify(data.level))
        }
    }

    useEffect(() => {
        if(authTokens) {
            getUserLevel()
        }
    }, [])




    const contextData = {
        user: user,
        authTokens: authTokens,
        successMessage: successMessage,
        gameLevel: gameLevel,
        setSuccessMessage: setSuccessMessage,
        login: login,
        logout: logout,
        updateLevel: updateLevel,
        setGameLevel: setGameLevel,
    }

    useEffect(() => {
       
        const fiftyFiveMinutes = 1000 * 60 * 55

        let interval = setInterval(() => {
            if(authTokens) {
                updateToken()
            }
        }, fiftyFiveMinutes)

        return () => clearInterval(interval)

    }, [authTokens])

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
