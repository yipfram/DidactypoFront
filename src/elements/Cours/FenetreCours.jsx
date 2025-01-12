import style from "../../style/Apprendre.module.css";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";


export default function FenetreCours(props) {
    const [index, setIndex] = useState(0);
    const [cours, setCours] = useState([]); // Table of all sub-parts of a course

    const partieCours = cours[index];
    const setShowCours = props.setShowCours;
    const idCours = props.idCours;

    // Decode escaped newlines
    function decodeEscapedString(str) {
        return str.replace(/\\n/g, "\n");
    }

    // Fetch and decode the course data
    async function genererCours() {
        try {
            const resultat = await api.get(`/sous_cours/${idCours}`);
            const decodedData = resultat.data.map(coursPart => ({
                ...coursPart,
                contenu_cours: decodeEscapedString(coursPart.contenu_cours || "")
            }));
            console.log("Decoded Data from API:", decodedData);
            setCours(decodedData);
        } catch (error) {
            console.error("Erreur lors de la récupération d'une partie d'un cours :", error);
        }
    }

    useEffect(() => {
        genererCours();
    }, []);

    function handlerNext() {
        if (index < cours.length - 1) setIndex(index + 1);
    }

    function handlerBack() {
        if (index > 0) setIndex(index - 1);
    }

    function handlerExit() {
        setShowCours(() => {
            const newMap = new Map(props.showCours);
            newMap.set(idCours, false);
            return newMap;
        });
    }

    function contenuPartieCours() {
        return (
            <div className={style.contenuPartieCours}>
                {partieCours ? ( 
                    <>
                        {/*pour générer le titre, le texte et l'image*/}
                        {partieCours.titre_sous_cours && <h1>{partieCours.titre_sous_cours}</h1>}
                        {partieCours.contenu_cours && (
                            <p className={style.contenuPartieCours}>{partieCours.contenu_cours}</p>
                        )}
                        {partieCours.chemin_img_sous_cours && (
                            <img src={partieCours.chemin_img_sous_cours} alt="image partie cours" />
                        )}
                        {/*On met seulement un boutton si le titre dans la bd (titre_sous_cours) est égal à "Exercice"*/}
                        {partieCours.titre_sous_cours === "Exercice" && <Link to={`/listeExercices?idExo=${partieCours.id_cours_parent}`}
                         className={style.boutonsCours}>Exercices</Link>}
                    </>
                ) : (
                    <p>Chargement...</p> //pour le temps d'attente de l'appel api
                )}
            </div>
        );
    }

    return (
        <>
            <div className={style.fenetreCours}>
                {contenuPartieCours()}
                <div className={style.groupeButtonFenetreCours}>
                    <button onClick={handlerBack} className={style.boutonsCours}>précédant</button>
                    <button onClick={handlerExit} className={style.boutonsCours}>sortir</button>
                    <button onClick={handlerNext} className={style.boutonsCours}>prochain</button>
                </div>
            </div>
        </>
    );
}
