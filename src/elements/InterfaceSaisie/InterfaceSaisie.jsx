import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import api from "../../api"; 


const InterfaceSaisie = ({ targetText, setEndTime, isReady, onExerciseComplete }) => {
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [errorCount, setErrorCount] = useState(0); // L'état pour suivre le nombre d'erreurs
    const [elapsedTime, setElapsedTime] = useState(0); // Temps écoulé en secondes
    const [wordCount, setWordCount] = useState(0); // Nombre de mots corrects
    const [wpm, setWpm] = useState(0); // Words per minute

    const inputRef = useRef();
    const timerRef = useRef(null);

    const getUserPseudo = () => {
        const token = window.localStorage.getItem("token");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.sub; //"sub" est le champ contenant le pseudo de l'utilisateur
    };

    const userPseudo = getUserPseudo();

    const handleInputChange = (e) => {
        const newText = e.target.value;
        setInputText(newText);

        let correctCount = 0;
        let errorCountLocal = errorCount;
        let hasErrorOccurred = false;

        // Calcul des caractères corrects et erreurs
        for (let i = 0; i < newText.length && i < targetText.length; i++) {
            if (newText[i] === targetText[i]) {
                correctCount++;
            } else {
                if (!hasErrorOccurred) {
                    errorCountLocal++;
                    hasErrorOccurred = true;
                }
            }
        }

        setCorrectChars(correctCount);
        setHasError(hasErrorOccurred);
        setErrorCount(errorCountLocal);

        // Calcul des mots corrects
        const targetWords = targetText.split(' ');
        const inputWords = newText.trim().split(' ');
        let correctWords = 0;

        for (let i = 0; i < inputWords.length; i++) {
            if (inputWords[i] === targetWords[i]) {
                correctWords++;
            } else {
                break; // Arrête de compter si une erreur est trouvée
            }
        }
        setWordCount(correctWords);

        // Fin de l'exercice
        if (newText === targetText) {
            clearInterval(timerRef.current); // Arrête le timer
            setEndTime(new Date());
            sendWPMtoBackend(wpm);
            if (onExerciseComplete) {
                onExerciseComplete();
            }
        }
    };

    useEffect(() => {
        if (isReady) {
            inputRef.current.focus();

            // Démarre le timer au début de l'exercice
            timerRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current); // Nettoyage du timer
        };
    }, [isReady]);

    useEffect(() => {
        // Calcul dynamique du WPM
        if (elapsedTime > 0) {
            setWpm(((wordCount / elapsedTime) * 60).toFixed(2)); // WPM = (mots / secondes) * 60
        }
    }, [elapsedTime, wordCount]);

    const progress = targetText ? (correctChars / targetText.length) * 100 : 0;

    const renderTextWithColors = () => {
        return targetText.split('').map((char, index) => {
            let color;
            if (index < inputText.length) {
                color = inputText[index] === char ? 'green' : 'red';
            } else {
                color = 'gray';
            }
            return (
                <span key={index} style={{ color }}>
                    {char}
                </span>
            );
        });
    };

    const sendWPMtoBackend = async (wpm) => {
        const typeStat = "wpm"
        try{
            await api.post(
                `/stat/?pseudo_utilisateur=${userPseudo}&type_stat=${typeStat}&valeur_stat=${wpm}`
            );

            if (wpm >= 100){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=15`);
            }
            if (wpm >= 80){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=14`);
            }
            if (wpm >= 60){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=13`);
            }
            if (wpm >= 40){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=12`);
            }
            if (wpm >= 25){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=11`);
            }
            if (wpm <= 10){
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=10`);
            }
        } catch (error) {
        }
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    marginBottom: '1em',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    maxWidth: '600px',
                    margin: '0 auto',
                }}
            >
                {renderTextWithColors()}
            </div>
            <form>
                <input
                    type="text"
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    disabled={!isReady}
                    style={{
                        width: '50%',
                        minWidth: '200px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '1.2em',
                        padding: '0.5em',
                        textAlign: 'center',
                        margin: '0 auto',
                        display: 'block',
                    }}
                />
            </form>
            <div
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    border: '1px solid black',
                    margin: '0 auto',
                    marginTop: '10px',
                    height: '7px',
                    backgroundColor: '#f5f5f5',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: hasError ? 'red' : 'green',
                        transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                />
            </div>

            {/* Affichage des stats */}
            <div style={{ marginTop: '10px', fontSize: '1.2em' }}>
                <p>Fautes : {errorCount}</p>
                <p>Temps écoulé : {elapsedTime} secondes</p>
                <p>WPM : {wpm}</p>
            </div>
        </div>
    );
};

export default InterfaceSaisie;
