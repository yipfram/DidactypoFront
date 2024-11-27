import React, { useState, useEffect, useRef } from 'react';
import api from "../api";

const InterfaceSaisie = () => {
    const [defis, setDefi] = useState([]);
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);
    const [hasError, setHasError] = useState(false);

    const inputRef = useRef();

    const fetchDefi = async () => {
        try {
            const reponse = await api.get("/defis");
            setDefi(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de défi :", error);
        }
    };

    useEffect(() => {
        fetchDefi();
    }, []);

    const targetText = defis.length > 0 ? defis[0].description_defi : '';
    const currentDefiId = defis.length > 0 ? defis[0].id_defi : null; // ID du défi

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
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);

    // Fonction pour mettre à jour la BD
    const updateDatabase = async (elapsedTime) => {
        try {
            const payload = {
                id_defi: currentDefiId,
                pseudo_utilisateur: "dotz", // Remplacer par le pseudo de l'utilisateur actuel
                temps_reussite: elapsedTime
            };
   
            console.log(payload);
   
            const headers = {
                'Accept': 'application/json'
            };
   
            await api.post(`/reussites_defi/?id_defi=${currentDefiId}&pseudo_utilisateur=dotz&temps_reussite=${elapsedTime}`, null, { headers }); // Remplacer par l'endpoint exact de ton API
            console.log("Base de données mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la base de données :", error);
        }
    };

    // Calculer le temps écoulé
    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000;
            setElapsedTime(timeDiff);
            setInputText('');
            setIsReady(false);

            // Appeler la mise à jour de la base de données
            if (timeDiff && currentDefiId) {
                updateDatabase(timeDiff);
            }
        }
    }, [endTime]);

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
                        height: '5px',
                        width: `${progress}%`,
                        background: hasError ? 'red' : 'green',
                        marginTop: '0.5em',
                        transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
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
