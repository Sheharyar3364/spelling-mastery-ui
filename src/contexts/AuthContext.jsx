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
        const puzzle_id = JSON.parse(localStorage.getItem("puzzle_id")) != null ? JSON.parse(localStorage.getItem("puzzle_id")) : "";
        
        if(puzzle_id) {
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
  
      if(!response.ok) {
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
  
      if(!response.ok) {
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
            body: JSON.stringify({"gameid": userGameId})
        });

        if(response.status === 200) {  // Status code changed to 201
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
            body: JSON.stringify({"gameid": userGameId, "status": 3})
        });

        if(response.status === 200) {  
            instantFetchUnplayedPuzzles()
            localStorage.removeItem("userGameId")
        } else {
            console.error("Failed to start the game:", response.status);
            return null;
        }
    }


  // fetching answers for the puzzle to validate against
  useEffect(() => {
    if (puzzle) {
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
        increaseLimit: increaseLimit,
        fetchNewGame: fetchNewGame,
        puzzle: puzzle,
        data: data,
        temproryPuzzleData: temproryPuzzleData,
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
