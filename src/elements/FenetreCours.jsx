import style from "../style/Apprendre.module.css";
import { useState, useEffect } from "react";
import api from "../api";

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
                        {partieCours.titre_sous_cours && <h1>{partieCours.titre_sous_cours}</h1>}
                        {partieCours.contenu_cours && (
                            <p className={style.contenuPartieCours}>{partieCours.contenu_cours}</p>
                        )}
                        {partieCours.chemin_img_sous_cours && (
                            <img src={partieCours.chemin_img_sous_cours} alt="image partie cours" />
                        )}
                    </>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className={style.fenetreCours}>
                {contenuPartieCours()}
                <div className={style.groupeButtonFenetreCours}>
                    <button onClick={handlerBack}>back</button>
                    <button onClick={handlerExit}>exit</button>
                    <button onClick={handlerNext}>next</button>
                </div>
            </div>
        </>
    );
}
