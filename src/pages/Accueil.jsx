import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import style from "../style/Accueil.module.css";

import Modal from "../elements/Components/Modal";
import Connexion from "../elements/CompteUtilisateur/Connexion";
import Leaderboard from "../elements/Defis/Defis";


export default function Accueil() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [connected, setConnected] = useState("Se connecter");

   useEffect(() => {
      if (window.localStorage.getItem("token")) {
         setConnected("Mon Profil");
      }
   }, []);

   const openModal = () => {
      if (window.localStorage.getItem("token")) {
         const token = window.localStorage.getItem("token");
         const decodedToken = jwtDecode(token);
         window.location.href = `/profil/${decodedToken.sub}`;
      }
      else {
         setIsModalOpen(true);
      }
   }
   const closeModal = () => setIsModalOpen(false);
 
   return (
    <>
    <main className={style.accueil}>
       <div className={style.accueilmenu}>
            <div className={style.texteaccueil}>
                <p>Bienvenue sur Didactypo ! <br/>
                Ici tu peux apprendre à mieux utiliser ton clavier et te mesurer aux autres en t'amusant !
                </p>
            </div>
            <div className={style.choixboutons}>
               <Modal show={isModalOpen} onClose={closeModal}>
                  <Connexion />
                  <button onClick={closeModal}>Annuler</button>
               </Modal>
               <input type="button" onClick={openModal} className={style.bouton} value={connected}/>
               <Link to="./apprendre" className={style.bouton}>Apprendre</Link>
               <Link to="./competition" className={style.bouton}>Compétition</Link>
            </div>
       </div>
       <div className={style.leaderboard}>
          <Leaderboard/>
       </div>
    </main>   
    </>
 )
}