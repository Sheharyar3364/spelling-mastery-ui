import { useContext, useMemo } from "react";
import { CircularProgress } from "./CircularProgress";
import { FoundWordsContext } from "../contexts/Contexts";
import AuthContext from "../contexts/AuthContext";

export const MemoizedCircularProgress = ({ setShowConfetti, showConfetti, setLoading }) => {
    const foundWordsState = useContext(FoundWordsContext)
    const foundWords = foundWordsState[0]
    const {updateLevel, gameLevel, setGameLevel} = useContext(AuthContext)
    return (
         <CircularProgress setLoading={setLoading} showConfetti={showConfetti} setShowConfetti={setShowConfetti} updateLevel={updateLevel} gameLevel={gameLevel} setGameLevel={setGameLevel} />
    )
}