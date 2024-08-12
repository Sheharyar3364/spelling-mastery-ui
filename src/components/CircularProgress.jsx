import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { 
  DataContext, 
  PuzzleContext, 
  GameLevelContext, 
  FoundWordsContext,
  GuessContext
} from "../contexts/Contexts";


export function CircularProgress( {setLoading, showConfetti, setShowConfetti, updateLevel, gameLevel, setGameLevel }) {
  const [guess, dispatchGuess] = useContext(GuessContext);
  const data = useContext(DataContext)
  const puzzle = useContext(PuzzleContext)
  const [gameLevelState, dispatchGameLevelState] = useContext(GameLevelContext)
  const [foundWords, setFoundWords] = useContext(FoundWordsContext)

    
  // Initialize increaseLimit from localStorage or default to 0
  const [increaseLimit, setIncreaseLimit] = useState(() => {
    const savedIncreaseLimit = localStorage.getItem("increaseLimit");
    return savedIncreaseLimit ? JSON.parse(savedIncreaseLimit) : 0;
  })


  // set increaseLimit to local Storage as soon as as foundWords changes
  useEffect(() => { 
    localStorage.setItem("increaseLimit", JSON.stringify(increaseLimit))
  }, [increaseLimit]) 

  const prevGameLevelState = useRef(gameLevel)

  // *********************************** BUSINESS LOGIC START *********************************************
// increasing level as soon as the threshold is met
useEffect(() => {
  console.log(increaseLimit)
  if (levelUpThreshold === foundWords.length || parseInt(localStorage.getItem("increaseLimit") == 100)) {
    setShowConfetti(true);
    foundWords.length = 0;

    setTimeout(() => {
      updateLevel(1);
      setIncreaseLimit(0);
      setShowConfetti(false);
      
      setTimeout(() => {
        if(!showConfetti) {
          setLoading(true);
        }
        
        // Another timeout to reset loading state after an operation
        setTimeout(() => {
          setLoading(false);
        }, 4000);

      }, 0); // Delay between confetti ending and loading state

    }, 3000); // Delay between threshold met and level update

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
    return data.filter(answer => {
      return answer.puzzle === puzzle[puzzle.length - 1].id
    })
  }

  // To thoughtfully decide the win level for playing user
  // every answer is an object

  // const fourLetterAnswers = totalAnswers().filter(answer => answer.word.length == 4)
  
  // const AnswersThatAreMorethanFourLetter = totalAnswers().filter(answer => answer.word.length > 4)
  
  // total score based on number of answers for a puzzle to decide win level
  // let estimatedTotalScore = 0;
  
  // fourLetterAnswers.map(answer => {
  //   estimatedTotalScore += 1
  // })

  // AnswersThatAreMorethanFourLetter.map(answer => {
  //   estimatedTotalScore += answer.word.length
  // })

  // ************************* LOGIC FOR FINDING TOTAL SCORE, COULD BE OF USE LATER START ********************


  // to determine determistic expected words from user in order to win and level up
  // const totalWords = totalAnswers().length
  const totalWords = 5


  //  user has to find Half of the words in order to win and level up to next level
  let levelUpThreshold;
  if(totalWords == 1) {
    levelUpThreshold = 1
  } else if (totalWords == 2) {
    levelUpThreshold = 2;
  } else if(totalWords > 2) {
    levelUpThreshold = Math.ceil(totalWords / 2)
  }

  const increaseChunk = Math.ceil( 100 / levelUpThreshold )

  // progressing percentage in the Circular Progress when score increases
  useEffect(() => {
    if(guess.score) {
      if(increaseLimit + increaseChunk > 100) {
        console.log("inside > 100")
        setIncreaseLimit(100)
      } else if (increaseLimit < 100) {
        console.log("below threshold")
        setIncreaseLimit(prevChunk => prevChunk + increaseChunk)
      }
     
    }
  }, [guess, guess.score, dispatchGuess])

  // *********************************** BUSINESS LOGIC END *********************************************

  
  return (
    <section className="circular-progress-container">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-1xl "><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 underline underline-offset-3 decoration-8 decoration-yellow-400">Level</span> <span className="underline underline-offset-3 decoration-8 decoration-yellow-400">{gameLevel}</span></h1>
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
  );
}
