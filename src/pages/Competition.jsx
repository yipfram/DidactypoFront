import React, { useState, useEffect } from 'react';
import api from "../api";
import style from '../style/Competition.module.css';

import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion.jsx';
import InterfaceSaisie from '../elements/InterfaceSaisie/InterfaceSaisie.jsx';
import Leaderboard from "../elements/Defis/Defis.jsx";

export default function Competition() {
    const [defis, setDefis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleDefiCompletion = async (id_defi, elapsedTime) => {
        try {
            const payload = {
                id_defi,
                pseudo_utilisateur: "dotz",
                temps_reussite: elapsedTime,
            };

            const headers = {
                'Accept': 'application/json',
            };

            await api.post(
                `/reussites_defi/?id_defi=${id_defi}&pseudo_utilisateur=dotz&temps_reussite=${elapsedTime}`,
                null,
                { headers }
            );

            console.log("Base de données mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la base de données :", error);
        }
    };

    return (
        <VerifConnection>
            <main className={style.Competition}>
                <h1>Competition</h1>
                {isLoading ? (
                    <p>Chargement des défis...</p>
                ) : error ? (
                    <p className={style.error}>{error}</p>
                ) : (
                    <div>
                        <div className={style.InterfaceSaisie}>
                            {defis[0] && (
                                <InterfaceSaisie
                                    defi={defis[0]}
                                    onCompletion={handleDefiCompletion}
                                />
                            )}
                        </div>
                        <div className={style.leaderboard}>
                            <Leaderboard />
                        </div>
                    </div>
                )}
            </main>
        </VerifConnection>
    );
}
