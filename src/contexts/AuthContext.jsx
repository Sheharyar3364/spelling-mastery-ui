import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


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
    const [fetchNewGame, setFetchNewGame] = useState(false)
    const [puzzle, setPuzzle] = useState()
    const [data, setData] = useState([]);
    const [temproryPuzzleData, setTemporaryPuzzleData] = useState("")

    // Initialize foundWords from localStorage or default to an empty array
    const [foundWords, setFoundWords] = useState(() => {
        const savedFoundWords = localStorage.getItem("foundWords");
        return savedFoundWords ? JSON.parse(savedFoundWords) : [];
    });




    // Initialize increaseLimit from localStorage or default to 0
    const [increaseLimit, setIncreaseLimit] = useState(() => {
        const savedIncreaseLimit = localStorage.getItem("increaseLimit");
        return savedIncreaseLimit ? JSON.parse(savedIncreaseLimit) : 0;
    })



    let login = async (event) => {
        event.preventDefault()
        let response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 'email': event.target.email.value, 'password': event.target.password.value })
        })

        let data = await response.json()

        if (response.status === 200) {
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            setAuthTokens(data)
            setGuestView(true)
            navigate("")
        }

    }

    const logout = () => {
        if (localStorage.getItem(`randomIndex${gameLevel}`)) {
            localStorage.removeItem(`randomIndex${gameLevel}`)
        }
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        localStorage.removeItem("gameLevel")
        localStorage.removeItem("puzzle_id")
        localStorage.removeItem("userGameId")
        localStorage.removeItem("currentLevel")
        localStorage.removeItem("foundWords")
        navigate("/login")
    }

    let updateToken = async () => {
        let response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        })

        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logout()
        }
        if (loading) {
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
        if (response.status == 200) {
            setGameLevel(data.level)
            localStorage.removeItem("hasGameStarted")
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
        if (response.status == 201) {
            setGameLevel(data.level)
            localStorage.setItem("gameLevel", JSON.stringify(data.level))
        }
    }


    const fetchUnplayedPuzzles = async () => {
        const token = JSON.parse(localStorage.getItem('authTokens'));
        try {
            const response = await fetch(`${BASE_URL}/bee/unplayed_puzzle/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token?.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log("User not authenticated")
                return
            }

            const data = await response.json();
            localStorage.removeItem("puzzle_id")
            localStorage.setItem("userGameId", data.user_game_id)
            return data
        } catch (error) {
            console.error('Error fetching unplayed puzzles:', error);
        }
    };


    const instantFetchUnplayedPuzzles = async () => {
        const token = JSON.parse(localStorage.getItem('authTokens'));
        try {
            const response = await fetch(`${BASE_URL}/bee/unplayed_puzzle/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token?.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log("User not authenticated")
                return
            }

            const data = await response.json();
            setPuzzle(data)
            localStorage.removeItem("puzzle_id")
            localStorage.setItem("userGameId", data.user_game_id)
        } catch (error) {
            console.error('Error fetching unplayed puzzles:', error);
        }
    };



    const completeGame = async (userGameId) => {
        const puzzleData = await fetchUnplayedPuzzles()
        setTemporaryPuzzleData(puzzleData)
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"));
        let response = await fetch(`${BASE_URL}/bee/complete_puzzle/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
            },
            body: JSON.stringify({ "gameid": userGameId })
        });

        if (response.status === 200) {  // Status code changed to 201
            localStorage.removeItem("userGameId")
            // startGame()
        } else {
            console.error("Failed to start the game:", response.status);
            return null;
        }
    }


    const skipGame = async (userGameId) => {
        setTemporaryPuzzleData(puzzle)
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"));
        let response = await fetch(`${BASE_URL}/bee/skip_puzzle/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
            },
            body: JSON.stringify({ "gameid": userGameId, "status": 3 })
        });

        if (response.status === 200) {
            instantFetchUnplayedPuzzles()
            localStorage.removeItem("userGameId")
        } else {
            console.error("Failed to start the game:", response.status);
            return null;
        }
    }

    const fetchFoundWords = async (userGameId) => {
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"));
    
        try {
            const response = await fetch(`${BASE_URL}/bee/fetch_found_words/${userGameId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Found Words:", data);
                setFoundWords(data)
            } else {
                console.error("Failed to fetch found words:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching found words:", error);
        }
    };
    


    const postFoundWords = async (userGameId, word) => {
        const authTokensInLocalStorage = JSON.parse(localStorage.getItem("authTokens"));
        let response = await fetch(`${BASE_URL}/bee/add_word/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokensInLocalStorage?.access}`
            },
            body: JSON.stringify({
                "gameid": userGameId,
                'word': word
            })
        });

        if (response.status === 200) {  // Status code changed to 201
            // const data = await response.json()
            // console.log("found Words", data)
            console.log("successfully posted word")
            return response
            // setFoundWords(data)
        } else {
            console.error("Failed to post found word:", response.status);
            return null;
        }
    }


    // fetching answers for the puzzle to validate against
    useEffect(() => {
        if (puzzle) {
            const foundWordsInLocalStorage = JSON.parse(localStorage.getItem("foundWords")) ? JSON.parse(localStorage.getItem("foundWords")) : ""
            console.log("foundWords in storage", foundWordsInLocalStorage)
            console.log(foundWords.length)
                if(foundWordsInLocalStorage && foundWords.length == 0) {
                    console.log("are we here")
                    const userGameId = JSON.parse(localStorage.getItem("userGameId"))
                    console.log("userGameId after login", userGameId)
                    fetchFoundWords(userGameId)
                }
            const puzzleId = puzzle.id
            localStorage.setItem("puzzle_id", puzzleId)
            axios.get(`${BASE_URL}/bee/answer/by-puzzle/${puzzleId}/`)
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching answers:', error);
                });
        }
    }, [puzzle]);


    useEffect(() => {
        if (authTokens) {
            const fetchData = async () => {
                const puzzleData = await fetchUnplayedPuzzles();
                setPuzzle(puzzleData);
                getUserLevel();
            };

            fetchData();
            
        }
    }, [authTokens])


    useEffect(() => {
        if (user) {
            setGameLevel(user.level)
        }
    }, [user])



    const contextData = {
        user: user,
        authTokens: authTokens,
        successMessage: successMessage,
        gameLevel: gameLevel,
        guestView: guestView,
        increaseLimit: increaseLimit,
        fetchNewGame: fetchNewGame,
        puzzle: puzzle,
        data: data,
        temproryPuzzleData: temproryPuzzleData,
        foundWords: foundWords,
        fetchFoundWords: fetchFoundWords,
        postFoundWords: postFoundWords,
        setFoundWords: setFoundWords,
        setUser: setUser,
        setAuthTokens: setAuthTokens,
        setTemporaryPuzzleData: setTemporaryPuzzleData,
        setData: setData,
        setPuzzle: setPuzzle,
        setFetchNewGame: setFetchNewGame,
        setIncreaseLimit: setIncreaseLimit,
        setSuccessMessage: setSuccessMessage,
        login: login,
        logout: logout,
        updateLevel: updateLevel,
        setGameLevel: setGameLevel,
        setGuestView: setGuestView,
        completeGame: completeGame,
        skipGame: skipGame,
        fetchUnplayedPuzzles: fetchUnplayedPuzzles
    }

    useEffect(() => {

        const fiftyFiveMinutes = 1000 * 60 * 55

        let interval = setInterval(() => {
            if (authTokens) {
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
