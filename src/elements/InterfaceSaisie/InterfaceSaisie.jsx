import React, { useState, useEffect, useRef } from 'react';

const InterfaceSaisie = ({ defi, onCompletion }) => {
    const targetText = defi?.description_defi || '';
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);
    const [hasError, setHasError] = useState(false);

    const inputRef = useRef();

    const handleInputChange = (e) => {
        if (!isReady) return;
        const newText = e.target.value;
        setInputText(newText);

        let correctCount = 0;
        let hasErrorOccurred = false;

        for (let i = 0; i < newText.length && i < targetText.length; i++) {
            if (newText[i] === targetText[i]) {
                correctCount++;
            } else {
                hasErrorOccurred = true;
                break;
            }
        }
        setCorrectChars(correctCount);
        setHasError(hasErrorOccurred);

        if (newText === targetText) {
            setEndTime(new Date());
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

    const handleReadyClick = () => {
        setIsReady(true);
        setInputText('');
        setCorrectChars(0);
        setStartTime(new Date());
        setEndTime(null);
        setElapsedTime(null);
        setHasError(false);
    };

    const handleResetClick = () => {
        setIsReady(false);
        setInputText('');
        setCorrectChars(0);
        setStartTime(null);
        setEndTime(null);
        setElapsedTime(null);
        setHasError(false);
    };

    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000;
            setElapsedTime(timeDiff);
            setInputText('');
            setIsReady(false);

            if (onCompletion) {
                onCompletion(defi.id_defi, timeDiff);
            }
        }
    }, [endTime, startTime, defi, onCompletion]);

    useEffect(() => {
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);

    return (
        <div style={{ textAlign: 'center' }}>
            {!isReady && (
                <button onClick={handleReadyClick} style={{
                    padding: '1em',
                    fontSize: '1em',
                    marginBottom: '1em',
                    cursor: 'pointer'
                }}>
                    Prêt
                </button>
            )}

            {isReady && (
                <>
                    <div style={{
                        marginBottom: '1em',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        maxWidth: '600px',
                        margin: '0 auto'
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
                                display: 'block'
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
                        position: 'relative'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: hasError ? 'red' : 'green',
                            transition: 'width 0.3s ease, background-color 0.3s ease'
                        }} />
                    </div>
                </>
            )}

            {elapsedTime && (
                <div style={{ marginTop: '1em', fontSize: '1.2em' }}>
                    Temps écoulé : {elapsedTime.toFixed(2)} secondes
                </div>
            )}

            {elapsedTime && (
                <button onClick={handleResetClick} style={{
                    padding: '1em',
                    fontSize: '1em',
                    cursor: 'pointer',
                    marginTop: '1em'
                }}>
                    Recommencer
                </button>
            )}
        </div>
    );
};

export default InterfaceSaisie;
