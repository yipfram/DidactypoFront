import { useState, useEffect } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie";
import style from "../style/Apprendre.module.css";
import api from "../api";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke les données de l'exercice sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Gère l'état de la pop-up
  const [exercises, setExercises] = useState([]);

  // Fonction pour récupérer les exercices
  const fetchTitreExercices = async () => {
    try {
      const response = await api.get("/exercices/");
      setExercises(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des exercices : ", error);
    }
  };

  useEffect(() => {
    fetchTitreExercices();
  }, []);

  // Fonction pour gérer le clic sur un bouton "Commencer"
  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise); // Définit l'exercice sélectionné
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
      console.log('Exercice marqué comme réalisé:', data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice comme réalisé:', error);
    }
  };
  


  // Fonction pour afficher la pop-up lorsque l'exercice est terminé
  const handleExerciseComplete = () => {
    setIsModalOpen(false); // Ferme la modale
    setIsPopupVisible(true); // Affiche la pop-up

    const exerciseId = selectedExercise.id_exercice; // Supposons que selectedExercise contienne les infos de l'exercice
    const userPseudo = "Dotz"; // Remplacez par la valeur réelle du pseudo de l'utilisateur

    markExerciseAsCompleted(exerciseId, userPseudo);

    setTimeout(() => {
      setIsPopupVisible(false); // Cache la pop-up après 3 secondes
      setSelectedExercise(null); // Réinitialise l'exercice sélectionné
    }, 3000); // Délai avant de cacher la pop-up
  };

  // Texte cible pour l'exercice
  const targetText = selectedExercise?.description_exercice;

  return (
    <>
      <main className={style.apprendre}>
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
                  setEndTime={() => {}} // Pas besoin de gérer ici, on utilise handleExerciseComplete
                  isReady={true} // Passe l'état "prêt" à InterfaceSaisie
                  onExerciseComplete={handleExerciseComplete} // Appelle la fonction lorsqu'exercice est terminé
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
