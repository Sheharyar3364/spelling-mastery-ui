export function scoreReducer(guess, action) {
  switch (action.type) {
    case 'increaseScore': {
      return {
        ...guess,
        score: guess.score + action.score,
      };
    }
    default: {
      return guess;
    }
  }
}
