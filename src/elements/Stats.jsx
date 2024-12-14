import api from "../api";
import { useState, useEffect } from "react";

export default function Stats(props) {
    const [moyMotsParMinute, setMoyMotsParMinute] = useState(0)
    const [numCours, setNumCours] = useState(0)
    const [tempsTotal, setTempsTotal] = useState(0)

    const fetchStats = async () => {
        const reponse = await api.get(`/stats/${props.pseudo}`);
        
        setMoyMotsParMinute(reponse.data.moyMotsParMinute);
        setNumCours(reponse.data.numCours);
        setTempsTotal(reponse.data.tempsTotal);
      };
    
      useEffect(() => {
        fetchStats();
      }, []);

    return(
    <div>
      <p>Nombre moyen de nombre par minute : {moyMotsParMinute}</p>
      <p>Cours fini : {numCours}</p>
      <p>Nombre moyen de nombre par minute : {tempsTotal}</p>
    </div>)
}