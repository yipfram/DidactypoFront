import Modal from '../Components/Modal';
import { useState, useRef, useEffect } from "react"
import {api} from '../../api';
import style from "../../style/MaClasse.module.css";

export default function CreerSupprExerciceClasse({ idClasse }) {

    const [messageRetour, setMessageRetour] = useState("Ajout avec succès!");
    const [modalOpenAjout, setModalOpenAjout] = useState(false);
    const [modalOpenSupp, setModalOpenSupp] = useState(false);
    const [popOpenAjout, setPopOpenAjout] = useState(false);
    const [popOpenSupp, setPopOpenSupp] = useState(false);
    const inputTitre = useRef();
    const inputContenu = useRef();
    const inputId = useRef();
    const [listeExercices, setListeExercices] = useState([]);

    function handlerModalAjoutOpen() {
        setModalOpenAjout(true);
    }

    function handlerModalAjoutClose() {
        setModalOpenAjout(false);
    }

    function handlerModalSuppOpen() {
        setModalOpenSupp(true);
    }

    function handlerModalSuppClose() {
        setModalOpenSupp(false);
    }

    const loadExercices = async () => {
        try {
            const response = await api.get(`/exercice_groupe/${idClasse}`);
            const data = response.data;
            const tab = data.map((e) => e.id_exercice);
            setListeExercices(tab);
        }
        catch (Exception) {
            console.error(Exception.message);
        }
    }

    useEffect(() => {

        loadExercices();
    }, [idClasse]);

    const handleSubmitAjout = async (e) => {
        e.preventDefault();
        try {
            if (!inputTitre.current.value || !inputContenu.current.value)
                throw new Error("Il faut entrer un titre et un contenu");

            const responseExo = await api.post('/exercices/', {
                titre_exercice: inputTitre.current.value,
                description_exercice: inputContenu.current.value
            });

            const responseLien = await api.post("/exercice_groupe/", {
                id_groupe: idClasse,
                id_exercice: responseExo.data.id_exercice
            });


            setMessageRetour("Ajout avec succès!");
        } catch (error) {
            setMessageRetour(error.message);
        }
        finally {
            setPopOpenAjout(true);
            handlerModalAjoutClose();
        }
    }

    const handleSubmitSupp = async (e) => {
        e.preventDefault();
        try {
            const idExercice = (Number(inputId.current.value));
            if (!idExercice || idExercice < 1 || idExercice > listeExercices.length)
                throw new Error("Le numéro n'est pas valide");

            const responseExo = await api.delete(`/exercices/${listeExercices[idExercice - 1]}`);

            const responseLien = await api.delete(`/exercice_groupe/${idClasse}/${listeExercices[idExercice - 1]}`);


            setMessageRetour("Suppression avec succès!");
        } catch (error) {
            setMessageRetour(error.message);
        }
        finally {
            setPopOpenSupp(true);
            handlerModalSuppClose();
        }
    }

    return (
        <>
            <button onClick={handlerModalAjoutOpen} className={style.btnajouter}>Ajouter un exercice</button>
            <Modal show={modalOpenAjout} onClose={handlerModalAjoutClose}>
                <form onSubmit={handleSubmitAjout} method="post">
                    <fieldset>
                        <label>
                            Titre de l'exercice
                            <input type="text" ref={inputTitre} />
                        </label>
                        <label>
                            Contenu de l'exercice
                            <input type="text" ref={inputContenu} />
                        </label>
                    </fieldset>

                    <button type="submit">enregister</button>
                </form>
            </Modal>
            {popOpenAjout && (
                <div>
                    <p> {messageRetour}</p>
                </div>
            )}

            <button onClick={handlerModalSuppOpen} className={style.btnajouter}>Supprimer un exercice</button>
            <Modal show={modalOpenSupp} onClose={handlerModalSuppClose}>
                <form onSubmit={handleSubmitSupp} method="post">
                    <fieldset>
                        <label>
                            Numéro de l'exercice (de 1 à x)
                            <input type="text" ref={inputId} />
                        </label>

                    </fieldset>

                    <button type="submit">enregister</button>
                </form>
            </Modal>
            {popOpenSupp && (
                <div>
                    <p> {messageRetour}</p>
                </div>
            )}
        </>
    )
}