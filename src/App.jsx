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
  const [puzzle, setPuzzle] = useState([])
  const [puzzleState, setPuzzleState] = useState([])
  const [puzzleIds, setPuzzleIds] = useState([])
  const [showMessage, setShowMessage] = useState(false);
  const [guess, dispatchGuess] = useReducer(scoreReducer, { score: 0 });
  // const [foundWords, setFoundWords] = useState([]);
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
  
  const prevGameLevelState = useRef(gameLevel);

  useEffect(() => {
    axios.get(`${BASE_URL}/bee/answer/`)
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        console.error('Error fetching answers:', error);
      });
  }, [])

  // fetching answers for the puzzle to validate against
  useEffect(() => {
    // Check if puzzles are fetched and puzzle array is not empty
    if (puzzle.length > 0 && gameLevel == 1) {
      const lastPuzzleId = puzzle[puzzle.length - 1].id;
      axios.get(`${BASE_URL}/bee/answer/by-puzzle/${lastPuzzleId}/`)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching answers:', error);
        });
    }
  }, [puzzle, setPuzzle]);

  function getRandomElementId(array) {
    const result = Math.floor(Math.random() * array.length);
    return result
  }
  


  // fetching puzzle
  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get(`${BASE_URL}/bee/puzzle/`);
        setPuzzle(response.data);
        setPuzzleState(response.data)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);



  useEffect(() => {
    if (!puzzleState || puzzleState.length === 0) {
      return; // Exit if puzzle data is not yet available
    }
    // Conditional fetch logic as explained above

    const puzzleIds = puzzleState.map(puzzle => puzzle.id)


    let randomIndex = getRandomElementId(puzzleIds)


    if (gameLevel !== 1) {
      let savedRandomIndex = randomIndex;
      const savedLevel = JSON.parse(localStorage.getItem("gameLevel"))
      try {
        savedRandomIndex = localStorage.getItem(`randomIndex${savedLevel}`) != null ? localStorage.getItem(`randomIndex${savedLevel}`) : randomIndex
      } catch (e) { console.log(e) }
      axios.get(`${BASE_URL}/bee/puzzle/${puzzleIds[savedRandomIndex]}/`)
        .then(response => {
          setPuzzle([response.data]);
          if (savedLevel !== prevGameLevelState.current) {
            localStorage.setItem(`randomIndex${savedLevel}`, randomIndex)
            localStorage.setItem("isSet", true)
            localStorage.removeItem(`randomIndex${prevGameLevelState.current}`)
            localStorage.removeItem("foundWords")
            foundWords.length = 0;
          }
          // Update the ref value for the next comparison
          prevGameLevelState.current = savedLevel;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

  }, [gameLevel, setGameLevel, puzzleState]);



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
