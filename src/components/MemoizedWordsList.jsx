import { useContext, useMemo } from "react"
import { WordsList } from "./WordsList"
import { FoundWordsContext } from "../contexts/Contexts"

export const MemoizedWordsList = () => {
    const foundWordsState = useContext(FoundWordsContext)
    const foundWords = foundWordsState[0]

    return useMemo(() => {
        return <WordsList foundWords={foundWords} />
    }, [foundWords.length])
}