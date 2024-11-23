import { useState, useEffect } from "react";
import api from "../api";

export default function Defis() {
    const [reussitesDefis, setReussitesDefis] = useState([]); // Définir l'état pour stocker les utilisateurs

    const fetchReussitesDefi = async () => {
        try {
            const reponse = await api.get("/reussites_defi");
            setReussitesDefis(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des réussites de défi :", error);
        }
    };

    useEffect(() => {
        fetchReussitesDefi();
    }, []);

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Affiche la date et l'heure sous un format local
    };

    return (
        <>
            <h2>Réussite du défi</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Numéro du défi</th>
                        <th>Temps</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reussitesDefis.map((reussiteDefi) => (
                        <tr key={`${reussiteDefi.pseudo_utilisateur}-${reussiteDefi.id_defi}`}>
                            <td>{reussiteDefi.pseudo_utilisateur}</td> {/* Affichage du pseudo de l'utilisateur */}
                            <td>{reussiteDefi.id_defi}</td> {/* Affichage de l'ID du défi */}
                            <td>{reussiteDefi.temps_reussite} min</td> {/* Affichage du temps de réussite */}
                            <td>{formatDate(reussiteDefi.date_reussite)}</td> {/* Formatage de la date */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
