import style from "../../style/Apprendre.module.css";
import { useState, useEffect } from "react";
import { api, getPseudo } from "../../api";
import { Link } from "react-router-dom";

export default function FenetreCours({ idCours, onClose }) {
    const [userPseudo, setUserPseudo] = useState(getPseudo());
    const [index, setIndex] = useState(0);
    const [cours, setCours] = useState([]);

    const partieCours = cours[index];
    const setShowCours = props.setShowCours;
    const idCours = props.idCours;

    useEffect(() => {
        setUserPseudo(getPseudo());
    }, []);

    useEffect(() => {
        setUserPseudo(getPseudo());
    }, []);

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
            setCours(decodedData);
        } catch (error) {
        }
    }

    useEffect(() => {
        genererCours();
    }, []);

    async function handlerNext() {
        if (index < cours.length - 1) {
            if (index === cours.length - 2) {
                try {    
                    const completionData = {
                        pseudo_utilisateur: userPseudo,
                        id_cours: parseInt(idCours),
                        progression: 100
                    };
                    await api.post('/completion_cours', completionData);
                } catch (error) {
                    if (error.response?.data?.detail) {
                        const erreurs = error.response.data.detail.map(err => 
                            `${err.loc.join('.')} : ${err.msg}`
                        ).join('\n');
                        alert(`Erreurs de validation:\n${erreurs}`);
                    }
                }
            }
            setIndex(index + 1);
        }
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
                        {partieCours.titre_sous_cours === "Exercice" && (
                            <Link 
                                to={`/apprendre/exercices?idExo=${partieCours.id_cours_parent}`}
                                className={style.boutonsCours}
                            >
                                Exercices
                            </Link>
                        )}
                    </>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>
        );
    }

    return (
        <div className={style.fenetreCours} onClick={(e) => e.stopPropagation()}>
            {contenuPartieCours()}
            <div className={style.groupeButtonFenetreCours}>
                <button onClick={handlerBack} className={style.boutonsCours}>précédent</button>
                <button onClick={onClose} className={style.boutonsCours}>sortir</button>
                <button onClick={handlerNext} className={style.boutonsCours}>prochain</button>
            </div>
        </div>
    );
}