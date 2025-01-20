import { useState, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import Modal from '../Components/Modal';
import api from '../../api';


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
            const token = window.localStorage.getItem("token");
            const decoded = jwtDecode(token);
            console.log(decoded.sub, String(ancienMdp.current.value), String(inputMdp.current.value));

            // Send the data as a JSON object in the request body
            const response = await api.patch("/modification_mdp", {
                pseudo: decoded.sub,
                ancien_mdp: ancienMdp.current.value,
                new_mdp: inputMdp.current.value,
            });

            setMessageRetour(response.data.message);
        } catch (error) {
            setMessageRetour("Erreur lors de la modification du mot de passe");
            console.error(error);
        } finally {
            handlerModalClose();
            setPopOpen(true);
        }
    };


    return (
        <>
            <button onClick={handlerChangementMdp}>Changer mot de passe</button>
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