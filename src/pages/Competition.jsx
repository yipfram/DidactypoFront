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
            } catch (err) {
                setError("Erreur lors de la récupération des défis.");
                setIsLoading(false);
            }
        };

        fetchDefis();
    }, []);

    // Logique pour démarrer la saisie
    const handleReadyClick = () => {
        setIsReady(true);
        setStartTime(new Date());
        setEndTime(null);
        setElapsedTime(null);
    };

    const gestionDefiQuotidien = async (userPseudo) => {
        const dateAct = new Date(); // Date actuelle en minutes
    
        try {
            const userResponse = await api.get(`/utilisateurs/${userPseudo}`);
            let cptDefi = userResponse.data.cptDefi;
            const reponse = await api.get(`/reussites_defi/${userPseudo}`);
            const reussites = reponse.data;

            if (!reussites || reussites.length === 0) {
                cptDefi = 1;
                await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });
                return cptDefi;
            }
    
            // Trier les réussites par date décroissante
            const sortedReussites = reussites.sort(
                (a, b) => new Date(b.date_reussite) - new Date(a.date_reussite)
            );
    
            const lastDateReussite = sortedReussites[1] ? new Date(sortedReussites[1].date_reussite) : null;
    
            if (lastDateReussite) {
                // Normaliser les dates pour comparer uniquement les jours
                const lastDay = new Date(lastDateReussite.getFullYear(), 
                                       lastDateReussite.getMonth(), 
                                       lastDateReussite.getDate());
                
                const currentDay = new Date(dateAct.getFullYear(),
                                          dateAct.getMonth(),
                                          dateAct.getDate());
                
                const daysDiff = Math.floor((currentDay - lastDay) / (1000 * 60 * 60 * 24));
                
                
                if (daysDiff === 0) {
                    return cptDefi;
                } else if (daysDiff === 1) {
                    cptDefi++;
                } else {
                    cptDefi = 1;
                }
            } else {
                cptDefi = 1;
                cptDefi = 1;
            }


            await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });
    
            // Gestion des badges
            try {
                const badges = [
                    { count: 3, id: 4 },
                    { count: 7, id: 5 },
                    { count: 14, id: 6 },
                    { count: 20, id: 7 }
                ];
    
                for (const badge of badges) {
                    if (cptDefi === badge.count) {
                        await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=${badge.id}`);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour des badges", error);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const cptDefi = 1;
                try {
                    await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });
                    return cptDefi;
                } catch (putError) {
                    console.error("Erreur lors de l'initialisation du compteur:", putError);
                    throw putError;
                }
            }
            console.error("Erreur lors de la gestion du défi quotidien:", error);
            throw error;
        }
    };
    

    // Calcul du temps écoulé une fois terminé
    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000;
            setElapsedTime(timeDiff);
            setIsReady(false);

            const updateDatabase = async () => {
                try {
                    const payload = {
                        id_defi: defis[0]?.id_defi,
                        pseudo_utilisateur: userPseudo,
                        temps_reussite: timeDiff,
                        pseudo_utilisateur: userPseudo,
                        temps_reussite: timeDiff,
                    };
                    const typeStat = "tempsdefi";

                    await api.post(
                        `/reussites_defi/?id_defi=${payload.id_defi}&pseudo_utilisateur=${userPseudo}&temps_reussite=${payload.temps_reussite}`
                    );
                    await api.post(
                        `/stat/?pseudo_utilisateur=${userPseudo}&type_stat=${typeStat}&valeur_stat=${payload.temps_reussite}`
                    );
                    //window.location.reload();

                    await gestionDefiQuotidien(userPseudo);

                } catch (error) {
                    console.error("Erreur lors de la mise à jour de la base de données :", error);
                }
            };

            updateDatabase();
        }
    }, [endTime]);

    const targetTextCompetition = defis.length > 0 ? defis[0]?.description_defi : '';

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
                        <div className={style.readyButtonContainer}>
                            <h3>
                            Bienvenue dans le mode compétition !
                            Ici, tu vas pouvoir te mesurer aux autres joueurs en réalisant des défis de vitesse de frappe.
                            Lorsque tu te sens prêt, appuie sur le bouton ci-dessous.
                            </h3>
                        <div className={style.readyButtonContainer}>
                            <h3>
                            Bienvenue dans le mode compétition !
                            Ici, tu vas pouvoir te mesurer aux autres joueurs en réalisant des défis de vitesse de frappe.
                            Lorsque tu te sens prêt, appuie sur le bouton ci-dessous.
                            </h3>
                            <button
                            onClick={handleReadyClick}
                            className={style.readyButton}
                            onClick={handleReadyClick}
                            className={style.readyButton}
                            >
                            Commencer le défi
                            Commencer le défi
                            </button>
                            <h3>
                            Si jamais tu as du mal, n'hésite pas à aller consulter l'onglet "Apprendre" ! Bonne chance !
                            </h3>
                        </div>
                            <h3>
                            Si jamais tu as du mal, n'hésite pas à aller consulter l'onglet "Apprendre" ! Bonne chance !
                            </h3>
                        </div>
                        )}
                        {isReady && targetTextCompetition && (
                            <InterfaceSaisie
                                targetText={targetTextCompetition}
                                setEndTime={setEndTime}
                                isReady={isReady}
                            />
                        )}
                        {elapsedTime && (
                            <div className={style.elapsedTime}>
                            <div className={style.elapsedTime}>
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
