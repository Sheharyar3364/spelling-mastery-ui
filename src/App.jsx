import { useEffect, useState, useReducer, useRef, useMemo } from 'react';
import { useContext } from 'react';
import axios from 'axios'
// Reducers
import { scoreReducer } from './reducers/scoreReducer.js';
import { GameLevelReducer } from "./reducers/GameLevelReducer.js"

// Contexts
import {
  DataContext,
  GuessContext,
  FoundWordsContext,
  PuzzleContext,
  GameLevelContext,
  MessagesContext
} from './contexts/Contexts.js';
import AuthContext from './contexts/AuthContext.jsx';

//pages
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';

// Components
import { Word } from './components/Word.jsx';
import { Honeycomb } from './components/Honeycomb';
import { Messages } from './components/Messages.jsx';
import { MemoizedCorrectGuesses } from './components/MemoizedCorrectGuesses.jsx';
import { MemoizedWordsList } from './components/MemoizedWordsList.jsx';
import { Nav } from './components/Nav.jsx';
import { Home } from './components/Home.jsx';
import { MemoizedCircularProgress } from './components/MemoizedCircularProgress.jsx';
import { WordContextProvider } from './components/WordContextProvider.jsx';
import { Footer } from './components/Footer.jsx';
import { ConfettiComp } from './components/ConfettiComp.jsx';

// REACT ROUTER
import {Routes, Route } from 'react-router-dom'

// utils
import PrivateRoutes from './utils/PrivateRoute.jsx';


const BASE_URL = import.meta.env.VITE_API_URL

function App() {
  const [data, setData] = useState([]);
  const [puzzle, setPuzzle] = useState()
  const [showMessage, setShowMessage] = useState(false);
  const [guess, dispatchGuess] = useReducer(scoreReducer, { score: 0 });
  const [gameLevelState, dispatchGameLevelState] = useReducer(GameLevelReducer, {
    currentLevel: localStorage.getItem("currentLevel") != null ? JSON.parse(localStorage.getItem("currentLevel")) : 1
  })
  const {user, gameLevel, setGameLevel, guestView, setGuestView} = useContext(AuthContext)
  const [loading, setLoading] = useState(false) 

  const [showConfetti, setShowConfetti] = useState(false)

  // Initialize foundWords from localStorage or default to an empty array
  const [foundWords, setFoundWords] = useState(() => {
    const savedFoundWords = localStorage.getItem("foundWords");
    return savedFoundWords ? JSON.parse(savedFoundWords) : [];
  });

  // Save foundWords to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("foundWords", JSON.stringify(foundWords));
  }, [foundWords]);



  useEffect(() => {
    localStorage.setItem("currentLevel", JSON.stringify(gameLevelState.currentLevel))
  }, [gameLevelState])
  


  // fetching answers for the puzzle to validate against
  useEffect(() => {
    // Check if puzzles are fetched and puzzle array is not empty
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
      console.log("data", data)
      setPuzzle(data)
    } catch (error) {
      console.error('Error fetching unplayed puzzles:', error);
    }
  };



const completeGame = async (userGameId) => {
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
    let data = await response.json();
    localStorage.removeItem("userGameId")
    await fetchUnplayedPuzzles()
  } else {
      console.error("Failed to start the game:", response.status);
      return null;
  }
}
  


  // fetching puzzle
  useEffect(() => {
    if(user) {
      fetchUnplayedPuzzles()
    }
  }, [user]);




  useEffect(() => {
    const userGameId = JSON.parse(localStorage.getItem("userGameId"))
    completeGame(userGameId)
  }, [gameLevel])



  if (guestView) {
    return (
      <>
       
            <Routes>
              <Route element={
                <>
                  <Nav />
                  <Home guestView={guestView} setGuestView={setGuestView} foundWords={foundWords} />
                </>
              } path="/" />
              <Route element={<LoginPage />} path="/login" />
              <Route element={<RegistrationPage />} path='/registration' />

            </Routes>
      </>
    )
  }

  return (
    <div>
      {showConfetti &&
        <div>
          <ConfettiComp />
          <h1 className="congratulation-message text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Congratulations!
            Level {gameLevel} completed.
          </h1>
        </div>
      }
      {loading && 
          <section>
            <Nav />
            <section className="home-container">
              <h1 className="text-3xl font-bold">
                Loading. We are fetching new Puzzle for you!
              </h1>
              <div className="lds-facebook"><div></div><div></div><div></div></div>
            </section>
          </section>
      }
      <>
        {data ?
          <DataContext.Provider value={data}>
            <PuzzleContext.Provider value={puzzle}>
              <GuessContext.Provider value={[guess, dispatchGuess]}>
                <FoundWordsContext.Provider value={[foundWords, setFoundWords]}>
                  <MessagesContext.Provider value={[showMessage, setShowMessage]}>
                    <GameLevelContext.Provider value={[gameLevelState, dispatchGameLevelState]}>
                      
                          <Routes>
                            <Route element={<LoginPage />} path='/login' />
                            <Route element={<RegistrationPage />} path='/registration' />
                            <Route element={<PrivateRoutes />}>
                              <Route element={
                                <>
                                  <Nav />
                                  <main className="app-container">
                                    <section className="container">
                                      <Messages />
                                      <MemoizedCircularProgress setShowConfetti={setShowConfetti} showConfetti={showConfetti} setLoading={setLoading} />
                                      <MemoizedCorrectGuesses />
                                      <WordContextProvider>
                                        <section className="words">
                                          <Word />
                                        </section>
                                        <section className="inputs">
                                          <section className="center">
                                            <Honeycomb />
                                          </section>
                                        </section>
                                      </WordContextProvider>
                                    </section>
                                    <section className="words-container">
                                      <MemoizedWordsList />
                                    </section>
                                  </main> </>}
                                path="/" />
                            </Route>
                          </Routes>
                    </GameLevelContext.Provider>
                  </MessagesContext.Provider>
                </FoundWordsContext.Provider>
              </GuessContext.Provider>
            </PuzzleContext.Provider>
          </DataContext.Provider>
          : <section>
              <Nav />
            <section className="home-container">
              <h1 className="text-3xl font-bold">
                Loading
              </h1>
              <div className="lds-facebook"><div></div><div></div><div></div></div>
            </section>
          </section>}
      </>
      <Footer />
    </div>

  );
}

export default App;
