import React, { useState, useEffect } from 'react';
import api from "../api";

const InterfaceSaisie = () => {
    const [defis, setDefi] = useState([]);
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);

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

    // Vérification du texte saisi
    const verifText = (e) => {
        e.preventDefault();
        if (inputText === targetText) {
            alert('Bravo !');
        } else {
            alert('Perdu !');
        }
        setInputText('');
    };

    return (
        <div>
            <div style={{ marginBottom: '1em' }}>
                {renderTextWithColors()}
            </div>
            <form onSubmit={verifText}>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
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
        </div>
    );
};

export default InterfaceSaisie;
