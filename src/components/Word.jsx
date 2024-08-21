import { useContext } from 'react';
import { useEffect, useRef } from "react";
import {
  DataContext,
  GuessContext,
  WordContext,
  FoundWordsContext,
  MessagesContext,
  PuzzleContext
} from '../contexts/Contexts';

import { handleWordValidation } from '../utils/handleWordValidation';
import AuthContext from '../contexts/AuthContext';

export function Word() {
  const [word, dispatchWord] = useContext(WordContext);
  const data = useContext(DataContext);
  const puzzle = useContext(PuzzleContext)
  const [guess, dispatchGuess] = useContext(GuessContext);
  const [foundWords, setFoundWords] = useContext(FoundWordsContext);
  const [showMessage, setShowMessage] = useContext(MessagesContext);
  const {postFoundWords} = useContext(AuthContext)

  const inputRef = useRef(null)

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.focus()
    }
  }, [puzzle])

  // making sure it run only once and iff when showMessage changes
  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false)
        dispatchWord({
          type: "clearContent",
        });
      }, 1000);
    }

  }, [showMessage])


  const handleEnter = (event) => {
    const answers = data[0].words
    if (event.key === "Enter") {
      const isValid = handleWordValidation(
        word,
        setShowMessage,
        answers,
        puzzle,
        foundWords,
        setFoundWords,
        dispatchGuess
      )

      console.log("isVALID", isValid)

      if(isValid) {
        const userGameId = JSON.parse(localStorage.getItem("userGameId"))
        console.log("useGameId + word", userGameId, word)
        postFoundWords(userGameId, word.content.toLowerCase())
      } 
    }
  };


  return (
    <>
      <input
        ref={inputRef}
        value={word.content.toUpperCase()}
        onChange={event =>
          dispatchWord({
            type: 'typeLetter',
            content: event.target.value,
          })
        }
        onKeyDown={handleEnter}
        placeholder="Type or click"
        className="custom-cursor"
      />
    </>
  );
}
