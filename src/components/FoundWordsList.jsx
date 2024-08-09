import { useState } from "react";

export const FoundWordsList = ({ foundWords }) => {
    const [isOpen, setIsOpen] = useState(false)

    const openSelectBlock = (event) => {
        event.preventDefault()
        if (foundWords.length > 0) {
            setIsOpen(true)
        }
    }

    const closeSelectBlock = (event) => {
        event.preventDefault()
        setIsOpen(false)
    }

    return (
        <section className="correct-guesses-section">
            {isOpen ? <section className="guess-words-open-list">
                <ul>
                    {/* Showing words list alphabatically for better UX */}
                    {[...foundWords].sort().map((guess, index) => {
                        const word = guess.charAt(0).toUpperCase() + guess.slice(1);
                        return <li className="guessed-word" key={guess}>
                            {word}
                        </li>
                    })}
                </ul>
                <svg onClick={closeSelectBlock} className="open-list-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                    <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
                </svg>
            </section>
                : <section onClick={openSelectBlock} className="guess-words-close-list">
                    <ul>
                        {/* inserting newest word in the front of close list select box */}
                        {foundWords.length > 0 ? [...foundWords].reverse().slice(0, 6).map((guess, index) => {
                            const word = guess.charAt(0).toUpperCase() + guess.slice(1);
                            return <li key={guess}>
                                {word}
                                {index < foundWords.length - 1 && index < 6 && ", "}
                            </li>
                        }): ""}

                        {foundWords.length >= 7 && <li>{foundWords[0][0].toUpperCase() + foundWords[0].slice(1, 3)}...</li>}

                    </ul>
                    <svg className="close-list-svg" width="13" height="8" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8167 0.203007C14.5724 -0.0676691 14.1774 -0.0676691 13.933 0.203007L7.49998 7.32879L1.06699 0.203007C0.822632 -0.0676691 0.42763 -0.0676691 0.18327 0.203007C-0.06109 0.473683 -0.06109 0.911224 0.18327 1.1819L7.05814 8.79715C7.18001 8.93215 7.34 9 7.50001 9C7.66003 9 7.82002 8.93215 7.94189 8.79715L14.8168 1.1819C15.0611 0.911224 15.0611 0.473683 14.8167 0.203007Z" fill="#6D7C95" /></svg>
                </section>
            }

        </section>
    )
}
