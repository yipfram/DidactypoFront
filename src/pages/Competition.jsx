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
        const dateAct = new Date();
        try {
            const userResponse = await api.get(`/utilisateurs/${userPseudo}`);
            let cptDefi = userResponse.data.cptDefi;
            const reponse = await api.get(`/reussites_defi/${userPseudo}`);
            const reussites = reponse.data;

            const sortedReussites = reussites.sort(
                (a, b) => new Date(b.date_reussite) - new Date(a.date_reussite)
            );

            const lastDateReussite = sortedReussites.length > 0 ? sortedReussites[0].date_reussite : null;

            if (lastDateReussite) {
                const dateDerniereReussite = new Date(lastDateReussite);

                const isSameDay = dateAct.getDate() === dateDerniereReussite.getDate() &&
                    dateAct.getMonth() === dateDerniereReussite.getMonth() &&
                    dateAct.getFullYear() === dateDerniereReussite.getFullYear();

                if (!isSameDay) {
                    cptDefi++;
                }
            } else {
                cptDefi = 1;
            }

            await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });

            try {
                if (cptDefi === 3) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=4`);
                if (cptDefi === 7) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=5`);
                if (cptDefi === 14) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=6`);
                if (cptDefi === 20) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=7`);
            } catch (error) {
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const cptDefi = 1;
                try {
                    await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });
                    return cptDefi;
                } catch (putError) {
                    throw putError;
                }
            }
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
                    };
                    const typeStat = "tempsdefi";

                    await api.post(`/reussites_defi/?id_defi=${payload.id_defi}&pseudo_utilisateur=${userPseudo}&temps_reussite=${payload.temps_reussite}`);
                    await api.post(`/stat/?pseudo_utilisateur=${userPseudo}&type_stat=${typeStat}&valeur_stat=${payload.temps_reussite}`);

                } catch (error) {
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
                            <button
                            onClick={handleReadyClick}
                            className={style.readyButton}
                            >
                            Commencer le défi
                            </button>
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
                        <div className={style.leaderboard}>
                            <Leaderboard />
                        </div>
                    </div>
                )}
            </main>
        </VerifConnection>
    );

}
