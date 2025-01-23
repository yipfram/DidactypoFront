import { useEffect, useState } from 'react';
import Stat from './Stat.jsx';

export default function CoursFinis({pseudo}) {
    const [stats, setStats] = useState([]);
    
    useEffect(() => {
        const fetchStats = async () => {
          try {
            const newStats = await Stat({ pseudo: pseudo, type: "courfini" });
            setStats(newStats);
          } catch (error) {
          }
        };
        
        fetchStats();
      }, []);

    return (
        <div>
        {stats && stats.map((stat, index) => (
            <div key={index}>
                <p>{stat.type_stat}</p>
                <p>{stat.valeur_stat}</p>
            </div>
        ))}
        </div>
    )
}