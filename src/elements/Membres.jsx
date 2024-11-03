import { useState, useEffect } from "react";
import api from "../api";

export default function Membres() {
    const [utilisateurs, setUtilisateurs] = useState([]); // Définir l'état pour stocker les utilisateurs

    const fetchUtilisateurs = async () => {
        try {
            const reponse = await api.get("/utilisateurs/");
            setUtilisateurs(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    useEffect(() => {
        fetchUtilisateurs();
    }, []);

    return (
        <>
            <h2>Liste des utilisateurs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Courriel</th>
                        <th>Est admin</th>
                        <th>Moyenne de mots par minute</th>
                        <th>Nombre de cours</th>
                        <th>Temps total</th>
                    </tr>
                </thead>
                <tbody>
                    {utilisateurs.map((utilisateur) => (
                        <tr key={utilisateur.pseudo}>
                            <td>{utilisateur.pseudo}</td>
                            <td>{utilisateur.nom}</td>
                            <td>{utilisateur.prenom}</td>
                            <td>{utilisateur.courriel}</td>
                            <td>{utilisateur.est_admin ? "Oui" : "Non"}</td>
                            <td>{utilisateur.moyMotsParMinute}</td>
                            <td>{utilisateur.numCours}</td>
                            <td>{utilisateur.tempsTotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
