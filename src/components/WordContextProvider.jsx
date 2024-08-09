import React, { useReducer } from "react";
import { WordContext,  } from "../contexts/Contexts";
import { wordReducer } from "../reducers/wordReducer";

export function WordContextProvider({ children }) {
    const [word, dispatchWord] = useReducer(wordReducer, { content: '' });

    return (
        <WordContext.Provider value={[word, dispatchWord]}>
            {children}
        </WordContext.Provider>
    )
}