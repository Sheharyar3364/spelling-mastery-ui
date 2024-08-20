import { useContext, useMemo } from "react";
import { CircularProgress } from "./CircularProgress";
import { FoundWordsContext } from "../contexts/Contexts";
import AuthContext from "../contexts/AuthContext";

export const MemoizedCircularProgress = ({ setShowConfetti, completeGame }) => {
    const foundWordsState = useContext(FoundWordsContext)
    const foundWords = foundWordsState[0]
    const {gameLevel, setGameLevel,  increaseLimit, setIncreaseLimit, setFetchNewGame} = useContext(AuthContext)
    return (
         <CircularProgress 
            setShowConfetti={setShowConfetti} 
            gameLevel={gameLevel} 
            setGameLevel={setGameLevel} 
            increaseLimit={increaseLimit} 
            setIncreaseLimit={setIncreaseLimit} 
            setFetchNewGame={setFetchNewGame}
            completeGame={completeGame}
         />
    )
}