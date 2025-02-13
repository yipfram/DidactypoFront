import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom'; //Pour récupérer les variables dans l'URL
import {jwtDecode} from "jwt-decode"; // Si non installé : npm install jwt-decode
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie.jsx";
import style from "../style/Apprendre.module.css";
import api from "../api";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke l'exercice sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Gère l'état de la pop-up
  const [endTime, setEndTime] = useState(null); // Stocke l'heure de fin d'exercice
  const [exercises, setExercises] = useState([]);
  const [searchParams] = useSearchParams(); //stocke les variables dans l'URL
  const idExo = searchParams.get('idExo'); //seulement si on passe par le bouton exercice dans le sous-cours

  

  // Récupère le pseudo de l'utilisateur depuis le token
  const getUserPseudo = () => {
    const token = window.localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.sub; // Remplacez "sub" par la clé correspondant au pseudo dans votre token
  };

  const userPseudo = getUserPseudo();

  // Fonction pour récupérer les exercices
  useEffect(() => {
    const fetchTitreExercices = async () => {
      try {
        const response = await api.get("/exercices/");
        setExercises(response.data.slice(0,5)); //uniquement les premiers 5, car les exos des groupes sont stockés au même endroit

        // If idExo is present in URL, select the exercise after fetching exercises
        if (idExo) {
          const exercise = response.data.find(ex => ex.id_exercice === parseInt(idExo));
          if (exercise) {
            setSelectedExercise(exercise);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
      }
    };
    fetchTitreExercices();
  }, [idExo]);

  // Fonction pour gérer le clic sur un bouton "Commencer"
  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise); // Définit l'exercice sélectionné
    setEndTime(null); // Réinitialise l'heure de fin
    setIsModalOpen(true); // Ouvre la modale
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false); // Ferme la modale
    setSelectedExercise(null); // Réinitialise l'exercice sélectionné
  };


  const markExerciseAsCompleted = async (exerciseId, userPseudo) => {
    try {
      const response = await fetch('/exercices_realises/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_exercice: exerciseId,
          pseudo: userPseudo,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'exercice');
      }
  
      const data = await response.json();
    } catch (error) {
    }
  };
  


  // Fonction pour afficher la pop-up lorsque l'exercice est terminé
  const handleExerciseComplete = async () => {
    setIsModalOpen(false); // Ferme la modale
    setIsPopupVisible(true); // Affiche la pop-up
    
    // Appel à l'API pour enregistrer l'exercice comme réalisé
    try {
      const response = await api.post("/exercices_realises/", null, {
        params: {
          id_exercice: selectedExercise.id_exercice,
          pseudo: userPseudo,
        },
      });
  
    } catch (error) {
    }
  
    // Cache la pop-up après 3 secondes
    setTimeout(() => {
      setIsPopupVisible(false); // Cache la pop-up
      setSelectedExercise(null); // Réinitialise l'exercice sélectionné
    }, 3000);
  };
  

  // Texte cible pour l'exercice
  const targetText = selectedExercise?.description_exercice;

  return (
    <>
      <main className={`${style.apprendre} ${style.exercices}`}>
        <h1>Exercices</h1>
        <div className={style.listeExercices}>
          {exercises.map((exercise) => (
            <div key={exercise.id_exercice} className={style.exercice}>
              <h2>{exercise.titre_exercice}</h2>
              <button onClick={() => handleStartExercise(exercise)}>
                Commencer
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modale */}
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            {selectedExercise && (
              <>
                <h2>{selectedExercise.titre_exercice}</h2>
                <InterfaceSaisie
                  targetText={targetText}
                  setEndTime={setEndTime} // Définit l'heure de fin via cette prop
                  isReady={true}
                  onExerciseComplete={handleExerciseComplete}
                />
              </>
            )}
            <button onClick={closeModal} className={style.closeButton}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Pop-up de félicitations */}
      {isPopupVisible && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <h2>Bravo pour avoir terminé cet exercice !</h2>
          </div>
        </div>
      )}
    </>
  );
}
