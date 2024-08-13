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
    const [gameLevel, setGameLevel] = useState()
    const [guestView, setGuestView] = useState(true)


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
        
        if(response.status === 200) {
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            setAuthTokens(data)
            setGuestView(true)
            navigate("")
        }
        
    }

    const logout = () => {
        if(localStorage.getItem(`randomIndex${gameLevel}`)) {
            localStorage.removeItem(`randomIndex${gameLevel}`)
        }
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
            localStorage.removeItem("hasGameStarted")
            setGuestView(true)
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
        if(response.status == 201) {
            setGameLevel(data.level)
            localStorage.setItem("gameLevel", JSON.stringify(data.level))
        }
    }


    const startGame = async () => {
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"));
        const puzzle_id = JSON.parse(localStorage.getItem("puzzle_id"));
        
    
        let response = await fetch(`${BASE_URL}/bee/start_game/`, {  // Note the trailing slash
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
            },
            body: JSON.stringify({"puzzle_id": puzzle_id})
        });
    
        if(response.status === 201) {  // Status code changed to 201
            localStorage.removeItem("puzzle_id")
            let data = await response.json();
            localStorage.setItem("userGameId", data.user_game_id)
            return data.user_game_id;
        } else {
            console.error("Failed to start the game:", response.status);
            return null;
        }
    }

    
    useEffect(() => {
        if(authTokens) {
            getUserLevel()
        }
    }, [])


    useEffect(() => {
        if(user) {
            setGameLevel(user.level)
        }
    }, [user])



    const contextData = {
        user: user,
        authTokens: authTokens,
        successMessage: successMessage,
        gameLevel: gameLevel,
        guestView: guestView,
        setSuccessMessage: setSuccessMessage,
        login: login,
        logout: logout,
        updateLevel: updateLevel,
        setGameLevel: setGameLevel,
        setGuestView: setGuestView,
        startGame: startGame,
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
