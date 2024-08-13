import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";


export function Home( {setGuestView, foundWords} ) {
    const {user, authTokens, logout, gameLevel, startGame} = useContext(AuthContext)

    const [play, setPlay] = useState(false)


    const startPlay = () => {
        localStorage.removeItem("increaseLimit")
        localStorage.removeItem("foundWords")
        foundWords.splice(0, foundWords.length)
        setPlay(true)
        setTimeout(() => {
            setGuestView(false)
        }, 1000)
    }


    const continuePlay = () => {
        setPlay(true)
        setTimeout(() => {
            setGuestView(false)
        }, 1000)
    }


    useEffect(() => {
        if(play) {
            if(!localStorage.getItem("hasGameStarted")) {
                startGame()
                localStorage.setItem("hasGameStarted", true)
            }
        }
    }, [play])


    if(play) {
        return(
            <section className="home-container">
                <h1 className="text-3xl font-bold">
                    Loading
                </h1>
                <div className="lds-facebook"><div></div><div></div><div></div></div>
            </section>
        )
    }


    return (
        <section className="bg-white home-container">
            <div className="text-center">
                {user && <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 underline underline-offset-3 decoration-8 decoration-yellow-400">
                    Welcome {user.name}!
                    <br /> <br />
                    <span className="underline underline-offset-3 decoration-8 decoration-yellow-400">Your Current Level: {gameLevel}</span>
                </h1>}
                <br />
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    A new way to play Spelling Bee.
                    <br />
                    We will make you competition-ready!                
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Play now and challenge yourself daily with our engaging Spelling Bee game, designed to boost your word skills and prepare you for any competition!                
                </p>    
                <div className="mt-10 flex items-center justify-center gap-x-6">
                {user && localStorage.getItem("increaseLimit") > 0 ?  <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-white rounded-lg group bg-gray-900 hover:bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100">
                        <span onClick={continuePlay} className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Continue Playing
                        </span>
                    </button> : '' }
                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-white rounded-lg group bg-gray-900 hover:bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100">
                        <span onClick={startPlay} className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Start New Game
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
