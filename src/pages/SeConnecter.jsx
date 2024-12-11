import { useState } from "react";
import jwt_decode from "jwt-decode";

import Connexion from "../elements/Connexion";
import Modal from "../elements/Modal";

export default function SeConnecter() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const token = window.localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);
    } catch (error) {
      console.error("Error decoding token", error);
    }
  }


  return (
    <div>
      <h1>React Modal Example</h1>
      <button onClick={openModal}>Open Modal</button>

      <Modal show={isModalOpen} onClose={closeModal}>
        <Connexion />
        <button onClick={closeModal}>Close Modal</button>
      </Modal>

      <p>Bienvenue !</p>
    </div>
  );
}