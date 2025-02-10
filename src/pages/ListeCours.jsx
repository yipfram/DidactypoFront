import api from "../api";
import { useState,useEffect } from "react";

import style from "../style/Apprendre.module.css";
import FenetreCours from "../elements/Cours/FenetreCours";

export default function ListeCours(){
    const [listeCours,setListeCours] = useState([]);
    const [courActif, setCourActif] = useState(null);

    const [showCours,setShowCours] = useState(new Map()); //gère la visibilité des cours, seulement un seul peut être visible à la foix
    // la map va ressembler à : {id_cours : false, id_cours : false}

    /**
     * initialise les deux variables useState
     */
    const fetchTitreCours = async () => {
        try {
            const reponse = await api.get("/cours/");
            setListeCours(reponse.data);
        } catch (error) {
            console.error("Erreur lors du chargement des cours");
        }        
    }

    useEffect(()=>{fetchTitreCours();},[]); 

    const toggleCours = (idCours) => {
        setCourActif(idCours === courActif ? null : idCours);
    };


    return(
        <>
            <main className={style.apprendre}>
                <div className={style.texteapprendre}>
                    <ol className={style.liste}>
                        {listeCours.map((cours)=>(
                            
                            <li key={cours.id_cours} className={style.texteListeApprendre} onClick={()=> toggleCours(cours.id_cours)} >
                                <p>{cours.titre_cours}</p>
                                {courActif === cours.id_cours && (
                                    <FenetreCours 
                                        idCours={cours.id_cours}
                                        onClose={() => setCourActif(null)}
                                    />
                                )}
                            </li>
                        ))}
                       
                    </ol>
                </div>   
            </main>
        </>
    );
}