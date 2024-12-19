import api from "../api";
import { useState,useEffect } from "react";

import style from "../style/Apprendre.module.css";
import FenetreCours from "../elements/Cours/FenetreCours";

export default function ListeCours(){
    const [listeCours,setListeCours] = useState([]);
    const [showCours,setShowCours] = useState(new Map()); //gère la visibilité des cours, seulement un seul peut être visible à la foix
    // la map va ressembler à : {id_cours : false, id_cours : false}

    /**
     * initialise les deux variables useState
     */
    const fetchTitreCours = async()=>{
        try {
            //requete bd
            const reponse = await api.get("/cours/");
            const data = reponse.data;
            //initialise showCours
            const initShowCours = new Map();
            data.forEach((cours)=>{
                initShowCours.set(cours.id_cours,false);
            });
            setShowCours(initShowCours);
            //initialise setListeCours
            setListeCours(data);

        } catch (error) {
            console.error("Erreur lors de la récupération des cours :", error )
        }        
    }

    useEffect(()=>{fetchTitreCours();},[]); 

    function handlerShowFenetreCours(key){

        //setShowCours(showCours.set(key,true)); //j'ai essayé avec un simple showCours.set(), mais ne marche pas

        setShowCours(()=>{  
            const newMap = new Map(showCours); // il faut lui donner une nouvelle map
            newMap.set(key,true);
            return newMap;
        });
    }


    return(
        <>
            <main className={style.apprendre}>
                <div className={style.texteapprendre}>
                    <ol>
                        {listeCours.map((cours)=>(
                            
                            <li key={cours.id_cours}>
                                <p onClick={()=>{handlerShowFenetreCours(cours.id_cours)}}>{cours.titre_cours}</p>
                                {/*Pour que seulement le cours cliqué s'affiche*/}
                                {showCours.get(cours.id_cours) && <FenetreCours idCours ={cours.id_cours} setShowCours={setShowCours}
                                showCours = {showCours}/>}
                            </li>
                        ))}
                       
                    </ol>
                </div>   
            </main>
        
        
        </>

    );
    
    
}