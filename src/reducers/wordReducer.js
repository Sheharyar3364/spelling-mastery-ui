export function wordReducer(word, action) {
  switch (action.type) {
    case "inputLetter": {
      return {
        ...word,
        content: word.content + action.content,
        center: action.center,
      };
    }
    case "removeLetter": {
      return {
        ...word,
        content: word.content.slice(0, -1),
      };
    }
    case "typeLetter": {
      return {
        ...word,
        content: action.content,
      };
    }
    case "clearContent": {
      return {
        ...word,
        content: "",
      };
    }
    default: {
      return word;
    }
  }
}
