import style from "../style/Apprendre.module.css";
import { useState } from "react";
import Cours from "./Cours";
import ListeCours from "../pages/ListeCours";

export default function FenetreCours(props){
    const [index,setIndex] = useState(0); 
    const [cours,setCours] = useState(genererCours());
    var partieCours = cours[index];

    const setShowCours = props.setShowCours();

    /**
     * fonction qui retourne un tableau contenant toutes les parties d'un cours, donc maximum une image par partie de cours
     */
    function genererCours(){
        //tableau avec p et lien vers image
        /*let cours = Cours(props.idCours);
        let partiesCours = cours.split(";");
        return partiesCours; */
        return ["Première page","Deuxième page"];
    }

    function HandlerNext(){
        if(index < cours.length-1)
            setIndex(index+1);
    }
    
    function HandlerBack(){
        if(index > 0)
            setIndex(index-1);
    }


    return(
        <>
            <div className={style.fenetreCours}>
                <p>{partieCours}</p>
                <div className = {style.groupeButtonFenetreCours}>
                    <button onClick={HandlerBack}> back </button>
                    <button onClick={props.setShowCours(false)}>exit</button>
                    <button onClick={HandlerNext}> next </button>
                </div>
            </div>
        </>

    );
}

