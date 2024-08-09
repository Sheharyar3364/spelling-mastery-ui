import { useContext } from 'react';
import { useEffect } from "react";
import {
  DataContext,
  GuessContext,
  WordContext,
  FoundWordsContext,
  MessagesContext,
  PuzzleContext
} from '../contexts/Contexts';

import { handleWordValidation } from '../utils/handleWordValidation';

export function Word() {
  const [word, dispatchWord] = useContext(WordContext);
  const data = useContext(DataContext);
  const puzzle = useContext(PuzzleContext)
  const [guess, dispatchGuess] = useContext(GuessContext);
  const [foundWords, setFoundWords] = useContext(FoundWordsContext);
  const [showMessage, setShowMessage] = useContext(MessagesContext);

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
    if (event.key === "Enter") {
      handleWordValidation(
        word,
        setShowMessage,
        data,
        puzzle,
        foundWords,
        setFoundWords,
        dispatchGuess
      )
    }
  };


  return (
    <>
      <input
        autoFocus
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
