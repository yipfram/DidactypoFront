import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPseudo } from "../api";
import style from "../style/Accueil.module.css";

import api from "../api";

import Modal from "../elements/Components/Modal";
import Connexion from "../elements/CompteUtilisateur/Connexion";
import Leaderboard from "../elements/Defis/Defis";
import Loading from "../elements/Components/Loading";

export default function Accueil() {
   const [idSemaine, setIdSemaine] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [connected, setConnected] = useState("Se connecter");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (window.localStorage.getItem("token")) {
         setConnected("Mon Profil");
      }
   }, []);

   const defiSemaine = async () => {
      try {
          const response = await api.get("/defi_semaine");
          const newId = response.data.numero_defi;
          setIdSemaine(newId);
          console.log("Id de la semaine :", newId); // ✅ Affiche la bonne valeur
      } catch (error) {
          console.error("Erreur lors de la récupération du défi de la semaine :", error);
      } finally {
          setLoading(false);
      }
   };

   useEffect(() => {
      defiSemaine();
   }, []);

   const openModal = () => {
      const pseudo = getPseudo();
      if (pseudo) {
         
         window.location.href = `/profil/${pseudo}`;
      }
      else {
         setIsModalOpen(true);
      }
   };

   const closeModal = () => setIsModalOpen(false);

   return (
      <>
         <main className={style.accueil}>
            <div className={style.accueilmenu}>
               <div className={style.texteaccueil}>
                  <p>
                     Bienvenue sur Didactypo ! <br />
                     Ici tu peux apprendre à mieux utiliser ton clavier et te mesurer aux autres en t'amusant !
                  </p>
               </div>
               <div className={style.choixboutons}>
                  <Modal show={isModalOpen} onClose={closeModal}>
                     <Connexion />
                     <button onClick={closeModal}>Annuler</button>
                  </Modal>
                  <input type="button" onClick={openModal} className={style.bouton} value={connected} />
                  <Link to="./apprendre" className={style.bouton}>Apprendre</Link>
                  <Link to="./competition" className={style.bouton}>Compétition</Link>
               </div>
            </div>
            <div className={style.leaderboard}>
               {loading ? <Loading /> : <Leaderboard idDefi={idSemaine} />}
            </div>
         </main>
      </>
   );
}
