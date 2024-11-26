import style from "../style/Apprendre.module.css";
import { useState } from "react";
import Cours from "./Cours";

export default function FenetreCours(idCours){
    const [index,setIndex] = useState(0); 
    const [cours,setCours] = useState(genererCours());
    var partieCours = cours[index];


    /**
     * fonction qui retourne un tableau contenant toutes les parties d'un cours, donc maximum une image par partie de cours
     */
    function genererCours(){
        //tableau avec p et lien vers image
        /*let cours = Cours(idCours);
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
                
                <button onClick={HandlerBack}> back </button>
                <button onClick={HandlerNext}> next </button>
            </div>
        </>

    );
}

