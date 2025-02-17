import { useState, useRef } from "react";
import Modal from '../Components/Modal';
import { api, getPseudo } from '../../api';
import style from "./ChangementMdp.module.css"

export default function ChangementMdp() {
    const [modalOpen, setModalOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [messageRetour, setMessageRetour] = useState("Modification avec succès!");
    const inputMdp = useRef();
    const ancienMdp = useRef();

    function handlerChangementMdp() {
        setModalOpen(true);
    }
    function handlerModalClose() {
        setModalOpen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const pseudo = getPseudo();

            // Send the data as a JSON object in the request body
            const response = await api.patch("/modification_mdp", {
                pseudo: pseudo,
                ancien_mdp: ancienMdp.current.value,
                new_mdp: inputMdp.current.value,
            });

            setMessageRetour(response.data.message);
        } catch (error) {
            if (error.response.status === 400)
                setMessageRetour("Le nouveau mot de passe ne peux pas être vide");
            else
                setMessageRetour("Le mot de passe est incorrecte");
        } finally {
            handlerModalClose();
            setPopOpen(true);
        }
    };


    return (
        <>
            <button onClick={handlerChangementMdp} className={style.changement}>Changer mot de passe</button>
            <Modal show={modalOpen} onClose={handlerModalClose}>
                <form onSubmit={handleSubmit} method="post">
                    <fieldset>
                        <label>
                            ancien mot de passe
                            <input type="password" ref={ancienMdp} />
                        </label>
                        <label>
                            nouveau mot de passe
                            <input type="password" ref={inputMdp} />
                        </label>
                    </fieldset>

                    <button type="submit">enregister</button>
                </form>
            </Modal>
            {popOpen && (
                <div>
                    <p> {messageRetour}</p>
                </div>
            )}
        </>
    );
}