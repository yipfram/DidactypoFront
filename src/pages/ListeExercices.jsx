import api from "../api";
import { useState,useEffect } from "react";

import style from "../style/Apprendre.module.css";

export default function ListeExercices(){
    


    return(
        <>
            <main className={style.apprendre}>
                <h1>Exercices</h1>
                <div className={style.listeExercices}>
                    <div className={style.exercice}>
                        <h2>Exercice 1</h2>
                        <p>Exercice de mathématiques</p>
                        <button>Commencer</button>
                    </div>
                    <div className={style.exercice}>
                        <h2>Exercice 2</h2>
                        <p>Exercice de français</p>
                        <button>Commencer</button>
                    </div>
                    <div className={style.exercice}>
                        <h2>Exercice 3</h2>
                        <p>Exercice d'anglais</p>
                        <button>Commencer</button>
                    </div>
                </div> 
            </main>
        
        
        </>

    );
    
    
}