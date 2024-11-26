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

    // Référence pour l'input
    const inputRef = useRef();

    // Récupération des défis via l'API
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

    // Définir le texte cible (par exemple, le premier défi)
    const targetText = defis.length > 0 ? defis[0].description_defi : '';

    // Gérer le changement de saisie
    const handleInputChange = (e) => {
        if (!isReady) return; // Bloque la saisie si pas prêt
        const newText = e.target.value;
        setInputText(newText);

        let correctCount = 0;
        for (let i = 0; i < newText.length && i < targetText.length; i++) {
            if (newText[i] === targetText[i]) {
                correctCount++;
            } else {
                break;
            }
        }
        setCorrectChars(correctCount);

        // Vérifie si tout le texte a été correctement saisi
        if (newText === targetText) {
            setEndTime(new Date()); // Arrête le chronomètre
        }
    };

    // Calculer la progression
    const progress = targetText ? (correctChars / targetText.length) * 100 : 0;

    // Rendre le texte avec des couleurs
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

    // Gérer le clic sur le bouton "Prêt"
    const handleReadyClick = () => {
        setIsReady(true);
        setInputText('');
        setCorrectChars(0);
        setStartTime(new Date()); // Démarre le chronomètre
        setEndTime(null);
        setElapsedTime(null);
    };

    useEffect(() => {
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);
    

    // Calculer le temps écoulé
    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000; // Temps en secondes
            setElapsedTime(timeDiff);
            setInputText(''); // Efface le texte après validation
            setIsReady(false); // Réinitialise l'état pour recommencer si besoin
        }
    }, [endTime]);

    // Vérification du texte saisi
    const verifText = (e) => {
        e.preventDefault();
        if (inputText === targetText) {
            setEndTime(new Date()); // Arrête le chronomètre si le texte est correct
        } else {
            alert('Perdu !');
            setInputText('');
        }
    };

    return (
        <div>
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
                    <div style={{ marginBottom: '1em' }}>
                        {renderTextWithColors()}
                    </div>
                    <form onSubmit={verifText}>
                        <input
                            type="text"
                            ref={inputRef} // Ajout de la référence pour le focus
                            value={inputText}
                            onChange={handleInputChange}
                            disabled={!isReady} // Désactive jusqu'à ce que prêt
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1.2em',
                                padding: '0.5em',
                            }}
                        />
                        <button type="submit" style={{ display: 'none' }} />
                    </form>
                    <div style={{
                        height: '5px',
                        width: `${progress}%`,
                        background: 'green',
                        marginTop: '0.5em',
                        transition: 'width 0.3s ease'
                    }} />
                </>
            )}

            {elapsedTime && (
                <div style={{ marginTop: '1em', fontSize: '1.2em' }}>
                    Temps écoulé : {elapsedTime.toFixed(2)} secondes
                </div>
            )}
        </div>
    );
};

export default InterfaceSaisie;
