import { useContext } from "react";
import { GuessContext, StepsContext } from "../contexts/Contexts";

export function Levels() {
    const [guess, dispatchGuess] = useContext(GuessContext);
    const [step, dispatchStep] = useContext(StepsContext)

    const rankings = ["Beginner", "Novice", "Okay", "Good", "Solid", "Nice", "Great", "Amazing", "Genius"]
    const rankingScore = [0, 5, 13, 21, 40, 67, 107, 134, 187]
    return (
        <section className="levels-container">
            <section className="ranking">
                <strong className="current-rank">{rankings[step.level]}</strong>
                <br />
                <span className="required-score-to-next-rank">{rankingScore[step.level + 1] - guess.score} to {rankings[step.level + 1]} </span>
            </section>
            <section className="progress-container">
                <span className={step.level == 0 ? "dot active" : "dot filled"}>
                    {step.level == 0 ? guess.score : ""}
                </span>
                <span className={step.level == 1 ? "dot active" : guess.score >= 5 ? "dot filled" : "dot"}>
                    {step.level == 1 ? guess.score : ""}
                </span>
                <span className={step.level == 2 ? "dot active" : guess.score >= 13 ? "dot filled" : "dot"}>
                    {step.level == 2 ? guess.score : ""}
                </span>
                <span className={step.level == 3 ? "dot active" : guess.score >= 21 ? "dot filled" : "dot"}>
                    {step.level == 3 ? guess.score : ""}
                </span>
                <span className={step.level == 4 ? "dot active" : guess.score >= 67 ? "dot filled" : "dot"}>
                    {step.level == 4 ? guess.score : ""}
                </span>
                <span className={step.level == 5 ? "dot active" : guess.score >= 107 ? "dot filled" : "dot"}>
                    {step.level == 5 ? guess.score : ""}
                </span>
                <span className={step.level == 6 ? "dot active" : guess.score >= 134 ? "dot filled" : "dot"}>
                    {step.level == 6 ? guess.score : ""}
                </span>
                <span className={step.level == 7 ? "dot active" : guess.score >= 187 ? "dot filled" : "dot"}>
                    {step.level == 7 ? guess.score : ""}
                </span>
                <span className="square"></span>
            </section>
        </section>
    );
}
