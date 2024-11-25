import { useState, useEffect } from "react";
import api from "../api";
import style from "../style/Defis.module.css";

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
            <table className={style.table}>
                <thead className={style.headtable}>
                    <tr>
                        <th className={style.headcell}>Pseudo</th>
                        <th className={style.headcell}>Numéro du défi</th>
                        <th className={style.headcell}>Temps</th>
                        <th className={style.headcell}>Date</th>
                    </tr>
                </thead>
                <tbody className={style.corpstable}>
                    {reussitesDefis.map((reussiteDefi) => (
                        <tr className={style.lignejoueur} key={`${reussiteDefi.pseudo_utilisateur}-${reussiteDefi.id_defi}`}>
                            <td className={style.cellule}>{reussiteDefi.pseudo_utilisateur}</td> {/* Affichage du pseudo de l'utilisateur */}
                            <td className={style.cellule}>{reussiteDefi.id_defi}</td> {/* Affichage de l'ID du défi */}
                            <td className={style.cellule}>{reussiteDefi.temps_reussite} min</td> {/* Affichage du temps de réussite */}
                            <td className={style.cellule}>{formatDate(reussiteDefi.date_reussite)}</td> {/* Formatage de la date */}
                        </tr>
                    ))}
                </tbody>
                
            </table>
        </>
    );
}
