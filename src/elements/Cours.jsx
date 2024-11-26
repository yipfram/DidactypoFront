import { useState, useEffect } from "react";
import api from "../api";

export default function Cours(id_cours) {
    const [cours, setCours] = useState([]); // Définir l'état pour stocker les cours

    const fetchCours = async () => {
        try {
            const reponse = await api.get(`/cours/${id_cours}`);
            setCours(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des cours :", error);
        }
    };

    useEffect(() => {
        fetchCours();
    }, []);

    return (
        <>{cours.description_cours}</>
    )
}