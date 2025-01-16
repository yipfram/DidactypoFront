import React, { useState, useEffect } from 'react';
import api from "../api";
import style from '../style/Competition.module.css';
import { jwtDecode } from "jwt-decode";
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion.jsx';
import InterfaceSaisie from '../elements/InterfaceSaisie/InterfaceSaisie.jsx';
import Leaderboard from "../elements/Defis/Defis.jsx";

export default function Competition() {
    const [defis, setDefis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    const getUserPseudo = () => {
        const token = window.localStorage.getItem("token");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.sub; //"sub" est le champ contenant le pseudo de l'utilisateur
    };

    const userPseudo = getUserPseudo();

    // Fetch des défis
    useEffect(() => {
        const fetchDefis = async () => {
            try {
                const response = await api.get("/defis");
                setDefis(response.data);
                setIsLoading(false);
                console.log("Défis récupérés :", response.data); // Vérification des défis
            } catch (err) {
                setError("Erreur lors de la récupération des défis.");
                setIsLoading(false);
            }
        };

        fetchDefis();
    }, []);

    // Logique pour démarrer la saisie
    const handleReadyClick = () => {
        console.log("Bouton 'Prêt' cliqué");
        setIsReady(true);
        setStartTime(new Date());
        setEndTime(null);
        setElapsedTime(null);
    };

    // Calcul du temps écoulé une fois terminé
    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000;
            setElapsedTime(timeDiff);
            setIsReady(false);

            // Mettre à jour la base de données
            const updateDatabase = async () => {
                try {
                    const payload = {
                        id_defi: defis[0]?.id_defi,
                        pseudo_utilisateur: userPseudo, // Utilisation du pseudo de l'utilisateur
                        temps_reussite: timeDiff,
                    };

                    await api.post(
                        `/reussites_defi/?id_defi=${payload.id_defi}&pseudo_utilisateur=${userPseudo}&temps_reussite=${payload.temps_reussite}`
                    );
                    console.log("Base de données mise à jour avec succès !");
                } catch (error) {
                    console.error("Erreur lors de la mise à jour de la base de données :", error);
                }
            };

            updateDatabase();
        }
    }, [endTime]);

    const targetTextCompetition = defis.length > 0 ? defis[0]?.description_defi : '';
    console.log("Target Text Competition :", targetTextCompetition); // Vérification du texte cible

    return (
        <VerifConnection>
            <main className={style.Competition}>
                {isLoading ? (
                    <p>Chargement des défis...</p>
                ) : error ? (
                    <p className={style.error}>{error}</p>
                ) : (
                    <div>
                        {!isReady && (
                            <button
                                onClick={handleReadyClick}
                                style={{
                                    padding: '1em',
                                    fontSize: '1em',
                                    marginBottom: '1em',
                                    cursor: 'pointer',
                                }}
                            >
                                Prêt
                            </button>
                        )}
                        {isReady && targetTextCompetition && (
                            <InterfaceSaisie
                                targetText={targetTextCompetition}
                                setEndTime={setEndTime}
                                isReady={isReady}
                            />
                        )}
                        {elapsedTime && (
                            <div style={{ marginTop: '1em', fontSize: '1.2em' }}>
                                Temps écoulé : {elapsedTime.toFixed(2)} secondes
                            </div>
                        )}
                        <div className={style.leaderboard}>
                            <Leaderboard />
                        </div>
                    </div>
                )}
            </main>
        </VerifConnection>
    );
}
