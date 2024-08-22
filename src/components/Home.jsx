import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link, json } from "react-router-dom";


export function Home( {setGuestView, foundWords} ) {
    const {user, gameLevel, setIncreaseLimit, skipGame, successMessage, fetchFoundWords} = useContext(AuthContext)

    const [play, setPlay] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const startNewGame = () => {
        if(JSON.parse(localStorage.getItem("foundWords")) || foundWords.length > 1) {
            localStorage.removeItem("foundWords")
            foundWords.splice(0, foundWords.length)
        }
        localStorage.removeItem("increaseLimit")
        localStorage.removeItem("currentLevel")
        setIncreaseLimit(0)
        setPlay(true)
        setTimeout(() => {
            setGuestView(false)
        }, 2000)
    }


    const startPlay = () => {
        if(foundWords.length > 0 && localStorage.getItem("foundWords")) {
            setShowConfirmation(true)
        } else if(foundWords.length < 1) {
           startNewGame()
        }
    }


    const continuePlay = () => {
        const userGameId = JSON.parse(localStorage.getItem("userGameId"))
        fetchFoundWords(userGameId)
        setPlay(true)
        localStorage.removeItem("currentLevel")
        setTimeout(() => {
            setGuestView(false)
        }, 1200)
    }


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

    const toggleConfirmation = (e) => {
        console.log("removed")
        e.preventDefault()
        setShowConfirmation(!showConfirmation)
    }

    const handleSkipGame = () => {
        const userGameId = JSON.parse(localStorage.getItem("userGameId"))
        skipGame(userGameId)
        startNewGame()
    }


    return (
        <>
        { successMessage && 
            <div class="flex justify-around items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">   
              <div class="">
                <span class="font-medium">Your Account</span> has been created successfully!
              </div>
          </div>
        }
        <section className="bg-white home-container">
            {showConfirmation && 
                <section className="confirmation">
                <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
                <div className="md:flex items-center">
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <p className="font-bold">Delete your account</p>
                    <p className="text-sm text-gray-700 mt-1">You will lose all of your answers and new puzzle will be fetched. This action cannot be undone.
                    </p>
                    </div>
                </div>
                <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                    <button onClick={handleSkipGame} className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-amber-300 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">Start New Game</button>
                    <button onClick={toggleConfirmation} className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
                    md:mt-0 md:order-1">Cancel</button>
                </div>
                </div>
                </section>

            }
            <div className="text-center">
                {user && <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 underline underline-offset-3 decoration-8 decoration-yellow-400">
                    Welcome {user.name}!
                    <br /> <br />
                    <span className="underline underline-offset-3 decoration-8 decoration-yellow-400">Your Current Level: { localStorage.getItem("gameLevel") ? localStorage.getItem("gameLevel") : gameLevel}</span>
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
                {user && foundWords.length ?  <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-white rounded-lg group bg-gray-900 hover:bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100">
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
        </>
    );
}
