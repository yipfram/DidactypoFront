import { useState, useEffect } from "react";
import api from "../../api";
import { jwtDecode } from "jwt-decode";
import style from "./Defis.module.css";

// Fonction pour obtenir le pseudo de l'utilisateur
const getUserPseudo = () => {
    const token = window.localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.sub; // "sub" est le champ contenant le pseudo de l'utilisateur
};

export default function Defis() {
    const userPseudo = getUserPseudo(); // Pseudo de l'utilisateur actuel
    const [reussitesDefis, setReussitesDefis] = useState([]);
    const [classementUtilisateur, setClassementUtilisateur] = useState(null); // Classement de l'utilisateur actuel

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fonction pour récupérer les réussites de défi
    const fetchReussitesDefi = async () => {
        try {
            const reponse = await api.get("/reussites_defi");
            const data = reponse.data.sort((a, b) => a.temps_reussite - b.temps_reussite);
            setReussitesDefis(data);

            // Trouver le classement de l'utilisateur actuel
            const indexUtilisateur = data.findIndex(
                (item) => item.pseudo_utilisateur === userPseudo
            );

            if (indexUtilisateur !== -1) {
                setClassementUtilisateur({
                    position: indexUtilisateur + 1,
                    ...data[indexUtilisateur],
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des réussites de défi :", error);
        }
    };

    useEffect(() => {
        fetchReussitesDefi();
    }, []);

    useEffect(() => {
        // Gérer les badges pour toutes les données chargées
        reussitesDefis.forEach((reussiteDefi, index) => {
            const position = index + 1;
            if (reussiteDefi.pseudo_utilisateur !== "---") {
                gererBadges(reussiteDefi.pseudo_utilisateur, position);
            }
        });
    }, [reussitesDefis]);

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Affiche la date et l'heure sous un format local
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = reussitesDefis.slice(startIndex, endIndex);

    // Ajouter des lignes vides si nécessaire pour atteindre 10 lignes
    const rows = [...currentItems];
    while (rows.length < itemsPerPage) {
        rows.push({
            pseudo_utilisateur: "---",
            temps_reussite: "---",
            date_reussite: "---",
        });
    }

    const utilisateurDansTop10 = currentItems.some(
        (item) => item.pseudo_utilisateur === userPseudo
    );

    if (!utilisateurDansTop10 && classementUtilisateur) {
        rows.push({
            pseudo_utilisateur: classementUtilisateur.pseudo_utilisateur,
            temps_reussite: classementUtilisateur.temps_reussite,
            date_reussite: classementUtilisateur.date_reussite,
            position: classementUtilisateur.position, // Ajouter une position explicite
        });
    }

    // Gérer les boutons de pagination
    const totalPages = Math.ceil(reussitesDefis.length / itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Fonction pour attribuer les badges
    const gererBadges = async (pseudo, position) => {
        try {
            const response = await api.get(`/badge/${pseudo}`);
            const badgesUtilisateur = response.data;
            const aDejaBadge = (idBadge) => badgesUtilisateur.some(badge => badge.id_badge === idBadge);

            if (position === 1 && !aDejaBadge(3)) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${pseudo}&id_badge=3`);
            }
            if (position <= 5 && !aDejaBadge(2)) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${pseudo}&id_badge=2`);
            }
            if (position <= 10 && !aDejaBadge(1)) {
                await api.post(`/gain_badge/?pseudo_utilisateur=${pseudo}&id_badge=1`);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour des badges :", error);
        }
    };

    return (
        <div>
            <table className={style.table}>
                <thead className={style.headtable}>
                    <tr>
                        <th className={style.headcell}>Position</th>
                        <th className={style.headcell}>Pseudo</th>
                        <th className={style.headcell}>Temps</th>
                        <th className={style.headcell}>Date</th>
                    </tr>
                </thead>
                <tbody className={style.corpstable}>
                    {rows.map((reussiteDefi, index) => {
                        const position = reussiteDefi.position || startIndex + index + 1;

                        return (
                            <tr
                                className={`${style.lignejoueur} ${
                                    reussiteDefi.pseudo_utilisateur === userPseudo ? style.utilisateurActuel : ""
                                }`}
                                key={index}
                            >
                                <td className={style.cellule}>{position}</td>
                                <td className={style.cellule}>{reussiteDefi.pseudo_utilisateur}</td>
                                <td className={style.cellule}>
                                    {reussiteDefi.temps_reussite !== "---"
                                        ? `${reussiteDefi.temps_reussite} s`
                                        : "---"}
                                </td>
                                <td className={style.cellule}>
                                    {reussiteDefi.date_reussite !== "---"
                                        ? formatDate(reussiteDefi.date_reussite)
                                        : "---"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className={style.pagination}>
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={style.pageButton}
                >
                    Précédent
                </button>
                <span className={style.pageInfo}>
                    Page {currentPage} sur {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={style.pageButton}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
