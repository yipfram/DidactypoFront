import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom'; //Pour récupérer les variables dans l'URL
import InterfaceSaisie from "../elements/InterfaceSaisie/InterfaceSaisie.jsx";
import style from "../style/Apprendre.module.css";
import { api, getPseudo } from "../api";

export default function ListeExercices() {
  const [selectedExercise, setSelectedExercise] = useState(null); // Stocke l'exercice sélectionné
  const [listeExercices, setListeExercices] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Gère l'état de la modale
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Gère l'état de la pop-up
  const [endTime, setEndTime] = useState(null); // Stocke l'heure de fin d'exercice
  const [exercises, setExercises] = useState([]);
  const [searchParams] = useSearchParams(); //stocke les variables dans l'URL
  const idExo = searchParams.get('idExo'); //seulement si on passe par le bouton exercice dans le sous-cours

  // Fonction pour récupérer les exercices
  useEffect(() => {
    const fetchTitreExercices = async () => {
      try {
        const response = await api.get("/exercices/");
        setExercises(response.data);

        // If idExo is present in URL, select the exercise after fetching exercises
        if (idExo) {
          const exercise = response.data.find(ex => ex.id_exercice === parseInt(idExo));
          if (exercise) {
            setSelectedExercise(exercise);
            setIsModalOpen(true);
            setListeExercices(false);
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
    setListeExercices(false);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false); // Ferme la modale
    setSelectedExercise(null); // Réinitialise l'exercice sélectionné
    setListeExercices(true);
  };

  const closePopUp = () => {
    setIsPopupVisible(false);
  }


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
    setListeExercices(true);
    setIsPopupVisible(true); // Affiche la pop-up
    const userPseudo = getPseudo();
    
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
  
    // Cache la pop-up après 2.5 secondes
    setTimeout(() => {
      setIsPopupVisible(false); // Cache la pop-up
    }, 2500);
  };
  

  // Texte cible pour l'exercice
  const targetText = selectedExercise?.description_exercice;

  return (
    <>
      <main className={`${style.apprendre} ${style.exercices}`}>
        {/* Liste des exercices */}
        {listeExercices && (
        <div className={style.listeExercices}>
          {exercises.map((exercise) => (
            <div key={exercise.id_exercice} className={style.exercice}>
              <h2>{exercise.titre_exercice}</h2>
              <button onClick={() => handleStartExercise(exercise)} className="btngeneral">
                Commencer
              </button>
            </div>
          ))}
        </div>
        )}
      {/* Modale */}
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            {selectedExercise && (
              <>
                <h2 className={style.titreExo}>{selectedExercise.titre_exercice}</h2>
                <InterfaceSaisie
                  targetText={targetText}
                  setEndTime={setEndTime} // Définit l'heure de fin via cette prop
                  isReady={true}
                  onExerciseComplete={handleExerciseComplete}
                />
              </>
            )}
            <button onClick={closeModal} className="btngeneral">
              Fermer
            </button>
          </div>
        </div>
      )}
      </main>


      {/* Pop-up de félicitations */}
      {isPopupVisible && (
        <div className={style.popup}>
          <button onClick={closePopUp} className={style.boutonfermer}>
            x
          </button>
          <div className={style.popupContent}>
            <h2>Bravo pour avoir terminé cet exercice !</h2>
          </div>
        </div>
      )}
    </>
  );
}
