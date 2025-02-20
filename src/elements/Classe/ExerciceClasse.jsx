import {useEffect, useState} from "react"
import {api} from '../../api';
import InterfaceSaisie from "../InterfaceSaisie/InterfaceSaisie";
import style from "../../style/Apprendre.module.css";

export default function ExerciceClasse({idClasse}){
    const [listeExercices,setListeExercices] = useState([]);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [selectedExercise,setExerciceSelected] = useState();
    const [isPopupVisible,setIsPopupVisible] = useState(false);
    const [endTime, setEndTime] = useState(null); // Stocke l'heure de fin d'exercice

    async function loadExercices(){
        try{
            const response = await api.get(`/exercice_groupe/${idClasse}`);
            setListeExercices(response.data);
        }
        catch(Exception){
            console.error(Exception.message);
        }
    }

    useEffect(()=>{
        loadExercices(); 
     },[idClasse]);
    
   function closeModal(){
    setIsModalOpen(false);
   }

   const closePopUp = () => {
    setIsPopupVisible(false);
  }


    function handlerStartExo(exo){
        setExerciceSelected(exo);
        setEndTime(null); // Réinitialise l'heure de fin
        setIsModalOpen(true);
    }

    function handleExerciceComplete(){
        setIsModalOpen(false);
        setExerciceSelected(null);
        setIsPopupVisible(true);
    }

    return(
        <>
            {/*La liste des exos*/}
            <div className={style.listeExercices}>
                {listeExercices.map((exo)=>(
                    <div key={exo.id_exercice} className={style.exercice}>
                        <h2>{exo.titre_exercice} </h2>
                        <button onClick={()=> handlerStartExo(exo)} className="btngeneral">Commencer</button>
                    </div>
                ))}
            </div>
            
            {/*Interface de saisie dans fenêtre*/}
            {isModalOpen && selectedExercise &&
                <div className={style.modal}>
                    <div className={style.modalContent}>
                        <h2>{selectedExercise.titre_exercice}</h2>
                        <InterfaceSaisie targetText={selectedExercise.description_exercice} isReady={true}
                         onExerciseComplete={handleExerciceComplete} setEndTime={setEndTime}></InterfaceSaisie>
                    </div>
                <button onClick={closeModal} className="btngeneral">Fermer</button>
                </div>
            }

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
    )
}