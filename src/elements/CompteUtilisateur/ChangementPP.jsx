import { useEffect, useState } from "react";
import Modal from "../Components/Modal";
import { api, getPseudo } from "../../api";
import style from "../../style/Compte.module.css";

export default function ChangementPP() {
    const [modalOpen, setModalOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [messageRetour, setMessageRetour] = useState("");
    const [selectedPP, setSelectedPP] = useState(null);
    const [photoProfil, setPhotoProfil] = useState([]);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    getPseudo();

    const fetchPP = async () => {
        try {
            const response = await api.get("/photo_profil");
            setPhotoProfil(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des photos de profil", error);
        }
    }

    useEffect(() => {
        fetchPP();
    }, []);

    const handlePPSelection = async (pp) => {
        setSelectedPP(pp); // Stocke l'objet au lieu de juste chemin_image
    };
    

    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedPP) {
            setMessageRetour("Veuillez sélectionner une photo de profil.");
            setPopOpen(true);
            return;
        }
        const pseudo = getPseudo();
        try {
            const response = await api.put(`/utilisateurs/${pseudo}/pdp`, { pdpActuelle: selectedPP});
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la photo de profil", error.response?.data || error.message);
            setMessageRetour(error.response?.data?.message || "Erreur lors de la mise à jour.");
        }
         finally {
            closeModal();
            window.location.reload();
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
                            {photoProfil.map((pp) => (
                                <img
                                    key={pp.id_photo}
                                    src={pp.chemin_image}
                                    alt={`Photo de profil ${pp.id_photo}`}
                                    className={`${style.PPImage} ${selectedPP === pp.id_photo ? style.Selected : ""}`}
                                    onClick={() => handlePPSelection(pp.id_photo)}
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
