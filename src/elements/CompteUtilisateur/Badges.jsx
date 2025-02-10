import { api } from "../../api";
import { useState, useEffect } from "react";

import style from "../../style/Compte.module.css";

export default function Badges(props) {
    const [badges, setBadges] = useState([]);
    const totalBadge = 14;
    const badgeHid = 9;

    const fetchBadges = async () => {
        try{
            const response = await api.get(`/badge/${props.pseudo}`);
            const userBadge = response.data;  

            const nbBadge = userBadge.length;
            const badgesManquant = 14 - nbBadge;

            const rep = await api.get(`/badge_manquant/${badgeHid}`);
            const badgeCache = rep.data;

            const badgesComplets = [...userBadge, ...Array(badgesManquant).fill(badgeCache)];
            
            setBadges(badgesComplets);
        } catch (error){
        }

    };

    useEffect(() => {
        fetchBadges();
    }, []);

    return (
        <div className={style.badges}>
            {badges.map((badge, index) => (
                <div key={`${badge.id_badge}-${index}`}>
                    <img src={badge.image_badge} alt={badge.titre_badge} />
                    <h3>{badge.titre_badge}</h3>
                    <p>{badge.description_badge}</p>
                </div>
            ))}
        </div>
    );
}

