import { useContext } from 'react';
import { GuessContext } from '../contexts/Contexts';

export function Score() {
  const [guess, dispatchGuess] = useContext(GuessContext);

  return (
    <>
      <section className="score-container">
        <h2 className="score">{guess.score}</h2>
      </section>
    </>
  );
}
