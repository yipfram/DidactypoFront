import React, { useState, useEffect, useRef } from 'react';

const InterfaceSaisie = ({ targetText, setEndTime, isReady, onExerciseComplete }) => {
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [errorCount, setErrorCount] = useState(0);  // L'état pour suivre le nombre d'erreurs

    const inputRef = useRef();

    const handleInputChange = (e) => {
        const newText = e.target.value;
        setInputText(newText);

        let correctCount = 0;
        let errorCountLocal = errorCount; // On garde l'état de errorCount
        let hasErrorOccurred = false;

        // Parcours de chaque caractère pour comparer
        for (let i = 0; i < newText.length && i < targetText.length; i++) {
            if (newText[i] === targetText[i]) {
                correctCount++;
            } else {
                if (!hasErrorOccurred) {
                    // Si c'est la première erreur, on incrémente le compteur
                    errorCountLocal++;
                    hasErrorOccurred = true; // On marque qu'il y a une erreur
                }
            }
        }

        setCorrectChars(correctCount);
        setHasError(hasErrorOccurred);
        setErrorCount(errorCountLocal); // On met à jour le nombre total d'erreurs

        // Quand le texte est exactement égal au texte cible, on termine l'exercice
        if (newText === targetText) {
            setEndTime(new Date());
            if (onExerciseComplete) {
                onExerciseComplete(); // Appelle la fonction de fin d'exercice
            }
        }
    };

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

    useEffect(() => {
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                marginBottom: '1em',
                fontSize: '1.5em',
                fontWeight: 'bold',
                maxWidth: '600px',
                margin: '0 auto',
            }}>
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
            <div style={{
                width: '100%',
                maxWidth: '600px',
                border: '1px solid black',
                margin: '0 auto',
                marginTop: '10px',
                height: '7px',
                backgroundColor: '#f5f5f5',
                position: 'relative',
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: hasError ? 'red' : 'green',
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                }} />
            </div>

            {/* Affichage du nombre de fautes */}
            <div style={{ marginTop: '10px', fontSize: '1.2em' }}>
                <p>Fautes : {errorCount}</p>
            </div>
        </div>
    );
};

export default InterfaceSaisie;
