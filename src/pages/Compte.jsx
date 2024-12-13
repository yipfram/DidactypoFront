import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Connexion from "../elements/Connexion";
import Modal from "../elements/Modal";
import Stats from "../elements/Stats";

export default function Compte() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // Efface le token dans le stockage local
    window.localStorage.removeItem("token");

    // Réinitialise l'état `decodedToken`
    setDecodedToken(null);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token", error);
        setDecodedToken(null);
      }
    }
  }, []);

  return (
    <div>
      <h1>{decodedToken ? `Bienvenue ${decodedToken.sub} !` : "Connectez vous pour accéder à votre progression !"}</h1>
      {!decodedToken ? (
        <button onClick={openModal}>Se connecter</button>
      ) : (
        <button onClick={handleLogout}>Se déconnecter</button>
      )}

      {!decodedToken ? (
        <Modal show={isModalOpen} onClose={closeModal}>
          <Connexion />
          <button onClick={closeModal}>Annuler</button>
        </Modal>
      ) : (
        <div>
          <Stats pseudo={decodedToken.sub} />
        </div>
      )}
    </div>
  );
}
