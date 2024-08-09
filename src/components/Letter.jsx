import { WordContext } from '../contexts/Contexts';
import { useContext } from 'react';

export function Letter({ letter, isCenter }) {
    const [word, dispatchWord] = useContext(WordContext);
    const grabWords = event => {
        
        dispatchWord({
            type: 'inputLetter',
            content: letter,
            center: isCenter ? true : false,
        });
    };

    
        return (
            <svg onClick={grabWords} className={"cell" + (isCenter ? " center-letter" : " outer-letter")} viewBox="0 0 120 103.92304845413263">
            <polygon className="cell-fill" points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263" stroke="white" strokeWidth="7.5"></polygon>
            <text className="cell-letter" x="50%" y="50%" dy="0.35em">{letter}</text>
        </svg>
        );
}
