import style from "../style/Apprendre.module.css";
import { useState,useEffect } from "react";
import api from "../api";
import ListeCours from "../pages/ListeCours";

export default function FenetreCours(props){
    const [index,setIndex] = useState(0); 
    const [cours,setCours] = useState([]); //tableau avec toutes les sous-parties d'un cours 
    
    var partieCours = cours[index];

    const setShowCours = props.setShowCours;  
    const idCours = props.idCours;  

    
    /**
     * Une partieCours est un paragraphe d'un cours qui est affiché dans FenetreCours et changé si on clique
     * sur les boutons correspondants. C'est pour rendre un cours plus lisible.
     */
    const genererCours = async() =>{
        try {
            const resultat = await api.get(`/sous_cours/${idCours}`); //on veut récupérer tous les souscours d'un cours
            setCours(resultat);
        } catch (error) {
            console.error("Erreur lors de la récupération d'une partie d'un cours :", error );
        }
    }

   useEffect(()=>{genererCours()})  // utiliser useEffect --> executer une seule fois au montage initial

    function handlerNext(){
        if(index < cours.length-1)
            setIndex(index+1);
    }
    
    function handlerBack(){
        if(index > 0)
            setIndex(index-1);
    }

    function handlerExit(){
        setShowCours(()=>{  
            const newMap = new Map(props.showCours); // il faut lui donner une nouvelle map
            newMap.set(idCours,false);
            return newMap;
        });
    }

    return(
        <>
            <div className={style.fenetreCours}>
                <div className={style.contenuPartieCours}>
                    <p>{partieCours}</p>
                </div>
                <div className = {style.groupeButtonFenetreCours}>
                    <button onClick={handlerBack}> back </button>
                    <button onClick={handlerExit}>exit</button> {/*setShowCours cache la FenetreCours */}
                    <button onClick={handlerNext}> next </button>
                </div>
            </div>
        </>

    );
}

