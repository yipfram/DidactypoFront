import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Modal from '../Components/Modal';
import Connexion from '../CompteUtilisateur/Connexion';
import { Link } from 'react-router-dom';

import style from './VerifConnexion.module.css';

export default function VerifConnection({ children }) {
  const [connected, setConnected] = useState(true);
  const [timeOut, setTimeOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const disconnect = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  }

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      setConnected(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const currentTime = Date.now() / 1000; // current time in seconds
      console.log(decoded.exp);
      console.log(currentTime);

      if (decoded.exp < currentTime) {
        setTimeOut(true);
      }
    } catch (error) {
      console.error("Invalid token", error);
      setConnected(false);
    }
  }, []);

  return (
    <>
      {connected ? (
        timeOut ? (
          <main>
            <div className={style.verif}>
              <h1>Votre session a expiré !</h1>
              <button onClick={openModal}>Se reconnecter</button>
              <button onClick={disconnect}>Se déconnecter</button>
            </div>
            <Modal show={isModalOpen} onClose={closeModal}>
              <Connexion />
              <button onClick={closeModal}>Annuler</button>
            </Modal>
          </main>
        ) : (
          children
        )
      ) : (
        <main>
          <div className={style.verif}>
            <h1>Vous devez être connecté pour accéder à cette page.</h1>
            <button onClick={openModal}>Se connecter</button>
            <h2>Vous n'avez pas de compte ?</h2>
            <Link to="/inscription">Créer un compte</Link>
          </div>
          <Modal show={isModalOpen} onClose={closeModal}>
            <Connexion />
            <button onClick={closeModal}>Annuler</button>
          </Modal>
        </main>
      )}
    </>
  );
}