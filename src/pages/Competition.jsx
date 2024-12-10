import React, { useState, useEffect } from 'react';
import InterfaceSaisie from '../elements/InterfaceSaisie.jsx';
import Leaderboard from "../elements/Defis.jsx";
import api from "../api";
import style from '../style/Competition.module.css';

export default function Competition() {
    const [defis, setDefis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch des défis
    useEffect(() => {
        const fetchDefis = async () => {
            try {
                const response = await api.get("/defis");
                setDefis(response.data); // Schedule state update
                setIsLoading(false);
            } catch (err) {
                setError("Erreur lors de la récupération des défis.");
                setIsLoading(false);
            }
        };

        fetchDefis(); // Call the fetch function
    }, []);

    // Log defis whenever it changes
    useEffect(() => {
        console.log(defis);
    }, [defis]);

    return (
        <main className={style.Competition}>
            <h1>Competition</h1>
            {isLoading ? (
                <p>Chargement des défis...</p>
            ) : error ? (
                <p className={style.error}>{error}</p>
            ) : (
                <div>
                    <div className={style.InterfaceSaisie}>
                        <InterfaceSaisie defi={defis[0]} />
                    </div>
                    <div className={style.leaderboard}>
                        <Leaderboard />
                    </div>
                </div>
            )}
        </main>
    );
}
