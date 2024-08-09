import { useContext } from 'react';
import {
    MessagesContext,
    FoundWordsContext,
} from '../contexts/Contexts';

export function Messages() {
    const [showMessage, setShowMessage] = useContext(MessagesContext);
    const [foundWords, setFoundWords] = useContext(FoundWordsContext);

    const messages = ["NON", "showScore", "missing-central-letter", "empty"]

    return (
        <section className="messages-container">
            <p
                className={showMessage && !messages.includes(showMessage)
                    ? 'found-message'
                    : 'unfound'
                }>
                Already Found
            </p>
            {/* by default show message is false, so not-found-message this class is applied and it is not showing */}
            <p
                className={
                    showMessage == 'NON' ? 'word-not-found' : 'not-found-message'
                }>
                Invalid Word{' '}
            </p>
            <p
                className={
                    showMessage == 'showScore' ? 'successMessage' : 'hiddenSuccess'
                }>
                Amazing
                {/* {foundWords.length > 0
                    ? foundWords[foundWords.length - 1].length == 4
                        ? 1
                        : foundWords[foundWords.length - 1].length
                    : 0} */}
                !
            </p>
            <p className={showMessage == "missing-central-letter" ? "missing-central-letter" : "hide-missing-message"}>
                Missing Central Letter
            </p>
            <p className={showMessage == "empty" ? "show-empty-error" : "hide-empty-error"}>
                Please insert a word
            </p>
        </section>
    );
}
