import style from "../style/Apprendre.module.css";
import FenetreCours from "../elements/FenetreCours";
import { useState } from "react";



export default function ListeCours(){
    const [showCours,setShowCours] = useState(false);
    const [listeCours,setListeCours] = useState(genererListeCours());



    function genererListeCours(){
        let listeCours = []; //titres et indices des cours donc tableau de dictionnaires

        return listeCours;
    }

    function handlerFenetreCours(){
        setShowCours(true);
    }

    return(
        <>
            <main className={style.apprendre}>
                <div className={style.texteapprendre}>
                    <ol>
                        <li>
                            
                            <p onClick={handlerFenetreCours}>premiers pas</p>
                            {showCours && <FenetreCours idCours = {1}/>}
                        </li>
                    </ol>
                </div>   
            </main>
        
        
        </>

    );
    
}