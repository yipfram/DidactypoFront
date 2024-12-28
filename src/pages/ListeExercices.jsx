import { useState } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie";
import style from "../style/Apprendre.module.css";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke les données de l'exercice sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale

  // Liste statique d'exercices pour le test
  const exercises = [
    { id: 1, title: "Exercice 1", description: "Exercice de mathématiques" },
    { id: 2, title: "Exercice 2", description: "Exercice de français" },
    { id: 3, title: "Exercice 3", description: "Exercice d'anglais" },
  ];

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

  return (
    <>
      <main className={style.apprendre}>
        <h1>Exercices</h1>
        <div className={style.listeExercices}>
          {exercises.map((exercise) => (
            <div key={exercise.id} className={style.exercice}>
              <h2>{exercise.title}</h2>
              <p>{exercise.description}</p>
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
                <h2>{selectedExercise.title}</h2>
                <InterfaceSaisie exerciseData={selectedExercise} />
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
