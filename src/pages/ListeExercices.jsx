import { useState, useEffect } from "react";
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie";
import style from "../style/Apprendre.module.css";
import api from "../api";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke les données de l'exercice sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale
  const [exercises, setExercises] = useState([]);

  // Liste statique d'exercices pour le test
  const fetchTitreExercices = async()=>{
    try {
      const response = await api.get("/exercices/");
      setExercises(response.data);

    } catch (error){
      console.log("Erreur lors de la recupération des exercices : ", error);
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
                <InterfaceSaisie defi={exercises[0]}
                                 setEndTime={setEndTime}
                                 isReady={isReady}  
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
