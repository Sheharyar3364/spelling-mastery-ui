export function WordsList({ foundWords }) {
    return (
        <div className="words-list-container">
            <p className="num-of-words-in-box">
                You have found {foundWords.length} {foundWords.length == 1 ? "word": "words"}
            </p>
            <ul className="words-list">
                {/* using built in functions of javaScript to capatilize the first word of found words */}
                {foundWords.map((word, index) => (
                    <li className="word" key={index}>
                        {word.split('')[0].toUpperCase() + word.slice(1)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
