import { useContext, useMemo } from "react";
import { FoundWordsList } from "./FoundWordsList";
import { FoundWordsContext } from "../contexts/Contexts";

export const MemoizedCorrectGuesses = () => {
    const foundWordsState = useContext(FoundWordsContext)
    const foundWords = foundWordsState[0]
    return useMemo(() => {
        return <FoundWordsList foundWords={foundWords} />
    }, [foundWords.length])
}