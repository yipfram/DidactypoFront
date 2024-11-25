import React, { useState } from 'react';

const InterfaceSaisie = ({ targetText = /*lien bd*/ }) => {
    const [inputText, setInputText] = useState('');
    const [correctChars, setCorrectChars] = useState(0);

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

    const progress = (correctChars / targetText.length) * 100;

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

    const verifText = (e) => {
        e.preventDefault();
        if (inputText === targetText) {
            alert('Bravo !');
        } else {
            alert('Perdu !');
        }
        setInputText('');
    }

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
