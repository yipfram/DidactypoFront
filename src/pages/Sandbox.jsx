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

    return (
        <main style={{ textAlign: "center", padding: "20px" }}>
            {!isReady ? (
                <div className={style.sandbox}>
                    <h2 className={style.titreGeneral}>Mode Sandbox</h2>
                    <h3 className={style.sousTitre}>
                        Bienvenue dans le mode Sandbox (Bac à sable), ici tu vas pouvoir t'entrainer a taper rapidement, ou sur ta technique.<br />
                        Tu peux écrire ton propre texte et appuyer sur le petit bouton pour démarrer l'exercice. Bonne chance !
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
            ) : (
                <div className={style.InterfaceSaisie}>
                <InterfaceSaisie targetText={targetText} isReady={isReady} />
                </div>
            )}
        </main>
    );
}
