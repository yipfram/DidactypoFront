import {useEffect, useState} from "react"
import api from '../../api';
import InterfaceSaisie from "../InterfaceSaisie/InterfaceSaisie";

export default function ExerciceClasse({idClasse}){
    const [listeExercices,setListeExercices] = useState([]);


    useEffect(()=>{
       loadExercices(); 
    }),[];

    async function loadExercices(){
        try{
            const response = await api.get(`/exercice_groupe/${idClasse}`);
            setListeExercices(response.data);
        }
        catch(Exception){
            console.error(Exception.message);
        }
    }
    
   

    function handlerStartExo(e){

    }

    return(
        <>
            <div>
                {listeExercices.map((exo)=>(
                    <div key={exo.id_exercice}>
                        <h1>{exo.titre_exercice} </h1>
                        <InterfaceSaisie targetText={exo.description_exercice} isReady={true}></InterfaceSaisie>
                        <button onClick={handlerStartExo}>Commencer</button>
                    </div>
                ))}
            </div>

        </>
    )
}