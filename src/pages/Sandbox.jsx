import { useState } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie.jsx";

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
                <div className="sandbox">
                    <h2>Mode Sandbox</h2>
                    <textarea
                        placeholder="Entrez votre texte ici..."
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        rows={3}
                        cols={50}
                        style={{ fontSize: "16px", padding: "5px" }}
                    />
                    <br />
                    <button onClick={handleStart} style={{ marginTop: "10px", padding: "8px 15px", fontSize: "16px" }}>
                        Démarrer l'exercice
                    </button>
                </div>
            ) : (
                <InterfaceSaisie targetText={targetText} isReady={isReady} />
            )}
        </main>
    );
}
