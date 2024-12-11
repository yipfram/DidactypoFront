import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Connexion from "../elements/Connexion";
import Modal from "../elements/Modal";

export default function SeConnecter() {
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

    alert("Vous êtes bien déconnecté");
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
      <h1>React Modal Example</h1>
      <button onClick={openModal}>Se connecter</button>
      <button onClick={handleLogout}>Se déconnecter</button>

      <Modal show={isModalOpen} onClose={closeModal}>
        <Connexion />
        <button onClick={closeModal}>Annuler</button>
      </Modal>

      <p>Bienvenue, {decodedToken?.sub || "n'hésitez pas à vous connecter"}!</p>
    </div>
  );
}