import { useState, useEffect } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie";
import style from "../style/Apprendre.module.css";
import api from "../api";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke les données de l'exercice sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale
  const [exercises, setExercises] = useState([]);
  const [endTime, setEndTime] = useState(null); // Ajoute la gestion de la fin d'exercice
  const [isReady, setIsReady] = useState(false); // Ajoute l'état "prêt"

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
                  setEndTime={setEndTime} // Passe la fonction à InterfaceSaisie
                  isReady={true} // Passe l'état "prêt" à InterfaceSaisie
                />
              </>
            )}
            <button onClick={closeModal} className={style.closeButton}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
