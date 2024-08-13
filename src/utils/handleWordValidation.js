export const handleWordValidation = (
  word,
  setShowMessage,
  data,
  puzzle,
  foundWords,
  setFoundWords,
  dispatchGuess
) => {
  const lowerCaseWord = word.content.toLowerCase();
  // console.log("lowercaseword", lowerCaseWord)

  if (lowerCaseWord.length === 0) {
    setShowMessage("empty");
  } else if (!lowerCaseWord.includes(puzzle.central_letter)) {
    setShowMessage("missing-central-letter");
  } else if (foundWords.includes(lowerCaseWord)) {
    setShowMessage(true); // Word already found
  } else if (data) {
    const validWord = data.find(answer => answer === lowerCaseWord)
    // console.log("data", data)
    // console.log("valid word", validWord)
    if (validWord) {
      if(!foundWords.includes(validWord)) {
        setFoundWords([...foundWords, lowerCaseWord]);
        dispatchGuess({
          type: "increaseScore",
          score: lowerCaseWord.length === 4 ? 1 : lowerCaseWord.length,
        });
        setShowMessage("showScore");
      } else if (foundWords.includes(validWord)) {
        setShowMessage(true)
      }
    } else {
      setShowMessage("NON"); // Word does not exist
    }
  }
};
