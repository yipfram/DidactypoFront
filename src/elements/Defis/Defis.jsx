import { useState, useEffect } from "react";
import api from "../../api";
import style from "./Defis.module.css";

export default function Defis() {
    const [reussitesDefis, setReussitesDefis] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; 

    const fetchReussitesDefi = async () => {
        try {
            const reponse = await api.get("/reussites_defi");
            setReussitesDefis(reponse.data.sort((a, b) => a.temps_reussite - b.temps_reussite));
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


    // Gérer les boutons de pagination
    const totalPages = Math.ceil(reussitesDefis.length / itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <>
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
                        {rows.map((reussiteDefi, index) => (
                            <tr className={style.lignejoueur} key={index}>
                                <td className={style.cellule}>
                                    {startIndex + index + 1} {/* Index global */}
                                </td>
                                <td className={style.cellule}>{reussiteDefi.pseudo_utilisateur}</td>
                                <td className={style.cellule}>
                                    {reussiteDefi.temps_reussite} {reussiteDefi.temps_reussite !== "---" ? "s" : ""}
                                </td>
                                <td className={style.cellule}>
                                    {reussiteDefi.date_reussite !== "---" ? formatDate(reussiteDefi.date_reussite) : "---"}
                                </td>
                            </tr>
                        ))}
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
        </>
    );
}
