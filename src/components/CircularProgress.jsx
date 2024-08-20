import { useContext, useEffect, useRef } from "react";
import { 
  DataContext, 
  PuzzleContext, 
  GameLevelContext, 
  FoundWordsContext,
  GuessContext
} from "../contexts/Contexts";


export function CircularProgress( { 
  setShowConfetti, 
  gameLevel, 
  setGameLevel, 
  increaseLimit, 
  setIncreaseLimit,
  setFetchNewGame,
  completeGame }
) {
  const [guess, dispatchGuess] = useContext(GuessContext);
  const data = useContext(DataContext)
  const puzzle = useContext(PuzzleContext)
  const [gameLevelState, dispatchGameLevelState] = useContext(GameLevelContext)
  const [foundWords, setFoundWords] = useContext(FoundWordsContext)

    

  // set increaseLimit to local Storage as soon as as foundWords changes
  useEffect(() => { 
    localStorage.setItem("increaseLimit", JSON.stringify(increaseLimit))
  }, [increaseLimit]) 

  const prevGameLevelState = useRef(gameLevel)

  // *********************************** BUSINESS LOGIC START *********************************************

// increasing level as soon as the threshold is met
useEffect(() => {
  if (increaseLimit == 100) {
    const userGameId = JSON.parse(localStorage.getItem("userGameId"))
    completeGame(userGameId)
    setFetchNewGame(true)
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000); // Delay between threshold met and level update

  }
}, [foundWords, setGameLevel, increaseLimit]);


  

  useEffect(() => {
    // Check if the game level has changed from the initial state (1)
    if (gameLevel !== 1 && gameLevel !== prevGameLevelState.current) {
      setIncreaseLimit(0)
    }

    prevGameLevelState.current = gameLevel
  }, [gameLevel]);

  // ************************* LOGIC FOR FINDING TOTAL SCORE, COULD BE OF USE LATER  ********************

  const totalAnswers = () => {
    return data[0]?.words
  }

  // ************************* LOGIC FOR FINDING TOTAL SCORE, COULD BE OF USE LATER START ********************


  // to determine determistic expected words from user in order to win and level up
  const totalWords = totalAnswers().length


  //  user has to find Half of the words in order to win and level up to next level
  let levelUpThreshold;
  if(totalWords == 1) {
    levelUpThreshold = 1
  } else if (totalWords == 2) {
    levelUpThreshold = 2;
  } else if(totalWords == 3) {
    levelUpThreshold = 3
  } else if(totalWords == 4) {
    levelUpThreshold = 4
  } else if(totalWords == 5) {
    levelUpThreshold = 5
  } else if(totalWords > 5) {
    levelUpThreshold = Math.ceil(((5 / 100) * totalWords) + gameLevel)
    // console.log("game level", gameLevel)
    // console.log("total words", totalWords)
    // console.log("level up Threshold", levelUpThreshold)
  }


  const increaseChunk = Math.ceil( 100 / levelUpThreshold )

  // progressing percentage in the Circular Progress when score increases
  useEffect(() => {
    if(foundWords.length > 0 && guess.score > 0) {
      if(increaseLimit + increaseChunk >= 100) {
        setIncreaseLimit(100)
      } else if (increaseLimit < 100) {
        setIncreaseLimit(prevChunk => prevChunk + increaseChunk)
      }
     
    }
  }, [guess, guess.score, dispatchGuess])

  // *********************************** BUSINESS LOGIC END *********************************************

  
  return (
    <>
    <section className="circular-progress-container">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-1xl "><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 underline underline-offset-3 decoration-8 decoration-yellow-400">Level</span> <span className="underline underline-offset-3 decoration-8 decoration-yellow-400">{ localStorage.getItem("gameLevel") ? localStorage.getItem("gameLevel") : gameLevel}</span></h1>
      <section className="circle">
        <div className="relative size-40">
          {/* Circular Progress */}
          <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-yellow-500"  strokeWidth="2"></circle>

            {/* Progress Circle inside a group with rotation (-clockwise direction) */}
            <g className="origin-center -rotate-90 transform">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200"  strokeWidth="2"  strokeDasharray="100" strokeDashoffset={increaseLimit}></circle>
            </g>
          </svg>
          {/* Percentage Text */}
          <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <span className="text-center text-2xl font-bold text-gray-800">{increaseLimit}%</span>
          </div>
        </div>
      </section>
    </section>
    </>
  );
}
