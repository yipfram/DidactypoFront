import { useState, useEffect } from "react";
import api from "../api";
import icone from "../img/IconCompte.png";
import style from "../style/MaClasse.module.css";


export default function listeEleve(){

    const [eleve, setEleve] = useState([]);

    const fetchEleve = async () => {
        try {
            const reponse = await api.get("/utilisateurs");
            setEleve(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    }

    useEffect(() => {
        fetchEleve();
    }, []);

    return (
        <>  
            <ul className={style.listeEleve}>
                {eleve.map((utilisateurs) => (
                    <li key={utilisateurs.pseudo} className={style.eleve}>
                        <span><img className={style.icone} src={icone} alt="icone" /></span>
                        {utilisateurs.pseudo}
                    </li>
                ))}
            </ul>
        </>
    );
}