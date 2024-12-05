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
            const data = resultat.data
            /* La table sous_cours a comme attributs : id_sous_cours,id_cours_parent, titre_sous_cours, contenu_cours, 
            * chemin_img_sous_cours. La clé primaire est sur les deux id
            * On utilise id_sous_cours pour définir l'ordre des sous cours
            */
            setCours(data);
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

    function contenuPartieCours(){
        return(
            <div className={style.contenuPartieCours}>
                    {partieCours ? ( //il faut faire ça à cause du delai de la requête bd, sinon il y a ReferenceError
                        <>
                        {/*Tests pour afficher un élément seulement si on l'a définit dans la bd
                        *On peut donc combiner les composants, par exemple seulement une image ou un titre et un paragraphe*/}

                        {partieCours.titre_sous_cours && <h1>{partieCours.titre_sous_cours}</h1>}
                        {partieCours.contenu_cours && <p>{partieCours.contenu_cours}</p>}
                        {partieCours.chemin_img_sous_cours && <img src={partieCours.chemin_img_sous_cours} alt="image partie cours"></img>}
                        
                        </>
                    ) : (
                        <p>Chargement...</p>
                    )}
                </div>
        );
    }

    return(
        <>
            <div className={style.fenetreCours}>
                {contenuPartieCours()}
                <div className = {style.groupeButtonFenetreCours}>
                    <button onClick={handlerBack}> back </button>
                    <button onClick={handlerExit}>exit</button> {/*setShowCours cache la FenetreCours */}
                    <button onClick={handlerNext}> next </button>
                </div>
            </div>
        </>

    );
}

