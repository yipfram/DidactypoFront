import React, { useState, useEffect, useRef } from 'react';
import { api, getPseudo } from "../../api"; 
import styles from "./InterfaceSaisie.module.css";

const InterfaceSaisie = ({ targetText, setEndTime, isReady, onExerciseComplete }) => {
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [wpm, setWpm] = useState(0);

    const [userPseudo, setUserPseudo] = useState(getPseudo());

    const inputRef = useRef();
    const timerRef = useRef(null);

    useEffect(() => {
        setUserPseudo(getPseudo());
    }, []);


    const handleInputChange = (e) => {
        const newText = e.target.value;
        setInputText(newText);

        let correctCount = 0;
        let errorCountLocal = errorCount;
        let hasErrorOccurred = false;

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

        const targetWords = targetText.split(' ');
        const inputWords = newText.trim().split(' ');
        let correctWords = 0;

        for (let i = 0; i < inputWords.length; i++) {
            if (inputWords[i] === targetWords[i]) {
                correctWords++;
            } else {
                break;
            }
        }
        setWordCount(correctWords);

        if (newText === targetText) {
            clearInterval(timerRef.current);
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
            timerRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isReady]);

    useEffect(() => {
        if (elapsedTime > 0) {
            setWpm(((wordCount / elapsedTime) * 60).toFixed(2));
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
        const typeStat = "wpm";
        try {
            await api.post(
                `/stat/?pseudo_utilisateur=${userPseudo}&type_stat=${typeStat}&valeur_stat=${wpm}`
            );

            if (wpm >= 100) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=15`);
            }
            if (wpm >= 80) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=14`);
            }
            if (wpm >= 60) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=13`);
            }
            if (wpm >= 40) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=12`);
            }
            if (wpm >= 25) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=11`);
            }
            if (wpm <= 10) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=10`);
            }
        } catch (error) {
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div className={styles.textContainer}>{renderTextWithColors()}</div>
            <form>
                <input
                    type="text"
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    disabled={!isReady}
                    className={styles.inputField}
                    onPaste={(e) => {e.preventDefault()}}
                    onDragStart={(e) => {e.preventDefault()}}
                    onDrop={(e) => {e.preventDefault()}}
                    style={{
                        background: hasError ? '#ff9999' : 'white',
                    }}
                    
                />
            </form>
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{
                        width: `${progress}%`,
                        background: hasError ? 'red' : 'green',
                    }}
                />
            </div>

            <div className={styles.statsContainer}>
                <p>Fautes : {errorCount}</p>
                <p>Temps écoulé : {elapsedTime} secondes</p>
                <p>Mots par minute : {wpm}</p>
            </div>
        </div>
    );
};

export default InterfaceSaisie;
