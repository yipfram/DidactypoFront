import { useState } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie.jsx";

import style from "../style/Sandbox.module.css";

export default function Sandbox() {
    const [customText, setCustomText] = useState("");
    const [targetText, setTargetText] = useState("");
    const [isReady, setIsReady] = useState(false);

    const handleStart = () => {
        if (customText.trim().length > 0) {
            setTargetText(customText);
            setIsReady(true);
        }
    };

    const handleDefiSelection = (defiText) => {
        setCustomText(defiText);  // Remplir le textarea avec le texte du défi
    };

    const defi1Text = `Dans les profondeurs de la jungle, l'explorateur intrépide trouva un temple oublié. Chaque gravure sur les murs semblait raconter une histoire mystérieuse, une énigme à résoudre avant que le soleil ne se couche. Attention aux pièges !`;
    const defi2Text = `Sous un ciel orageux, le capitaine Barbe-Noire guida son équipage vers une île cachée. Le trésor y était enfoui, protégé par des légendes terrifiantes. Entre les éclairs et le rugissement des vagues, les pirates avancèrent, bravant tous les dangers.`;

    return (
        <main style={{ textAlign: "center", padding: "20px" }}>
            {!isReady ? (
                <>
                    <div className={style.sandbox}>
                        <h2 className={style.titreGeneral}>Mode Sandbox</h2>
                        <h3 className={style.sousTitre}>
                            Bienvenue dans le mode Sandbox (Bac à sable), ici tu vas pouvoir t'entraîner à taper rapidement ou à améliorer ta technique.<br />
                            Tu peux écrire ton propre texte et appuyer sur le bouton pour démarrer l'exercice. Bonne chance !
                        </h3>
                        <textarea
                            placeholder="Entrez votre texte ici..."
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            rows={3}
                            cols={50}
                            style={{ fontSize: "16px", padding: "5px", marginTop: "4vh" }}
                        />
                        <br />
                        <button onClick={handleStart}>
                            Démarrer l'exercice
                        </button>
                    </div>

                    <div className={style.selectionDefis}>
                        <h2 className={style.titreGeneral}>Défis</h2>
                        <h3 className={style.sousTitre}>
                            Tu peux aussi choisir un texte de notre sélection pour t'entraîner. Clique sur le bouton pour commencer.
                        </h3>
                        <button onClick={() => handleDefiSelection(defi1Text)}>
                            Défi 1
                        </button>
                        <button onClick={() => handleDefiSelection(defi2Text)}>
                            Défi 2
                        </button>
                    </div>
                </>
            ) : (
                <div className={style.InterfaceSaisie}>
                    <InterfaceSaisie targetText={targetText} isReady={isReady} />
                </div>
            )}
        </main>
    );
}
