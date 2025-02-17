import { useState } from "react";
import Modal from "../Components/Modal";
import { api, getPseudo } from "../../api";
import style from "../../style/Compte.module.css";

const predefinedPPs = [
    "/images/pp1.png",
    "/images/pp2.png",
    "/images/pp3.png",
    "/images/pp4.png",
];

export default function ChangementPP() {
    const [modalOpen, setModalOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [messageRetour, setMessageRetour] = useState("");
    const [selectedPP, setSelectedPP] = useState(null);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handlePPSelection = (pp) => {
        setSelectedPP(pp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPP) {
            setMessageRetour("Veuillez sélectionner une photo de profil.");
            setPopOpen(true);
            return;
        }

        try {
            const response = await api.patch("/modification_pp", {
                pseudo: getPseudo(),
                new_pp: selectedPP,
            });

            setMessageRetour(response.data.message || "Photo de profil mise à jour !");
        } catch (error) {
            setMessageRetour("Erreur lors de la mise à jour.");
        } finally {
            closeModal();
            setPopOpen(true);
        }
    };

    return (
        <>
            <button onClick={openModal} className={style.ChangementPP}>
                Changer de photo de profil
            </button>

            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Choisissez une photo :</legend>
                        <div className={style.PPSelection}>
                            {predefinedPPs.map((pp, index) => (
                                <img
                                    key={index}
                                    src={pp}
                                    alt={`Photo de profil ${index + 1}`}
                                    className={`${style.PPImage} ${selectedPP === pp ? style.Selected : ""}`}
                                    onClick={() => handlePPSelection(pp)}
                                />
                            ))}
                        </div>
                    </fieldset>
                    <button type="submit" disabled={!selectedPP}>Enregistrer</button>
                </form>
            </Modal>

            {popOpen && (
                <div className={style.messageRetour}>
                    <p>{messageRetour}</p>
                </div>
            )}
        </>
    );
}
