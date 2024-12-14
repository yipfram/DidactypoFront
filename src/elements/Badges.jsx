import api from "../api";
import { useState, useEffect } from "react";

import style from "../style/Compte.module.css";

export default function Badges(props) {
    const [badges, setBadges] = useState([]);

    const fetchBadges = async () => {
        const response = await api.get(`/utilisateurs/moi/badge/${props.pseudo}`);
        setBadges(response.data);
    };

    useEffect(() => {
        fetchBadges();
    }, []);

    return (
        <div className={style.badges}>
            {badges.map((badge) => (
                <div key={badge.id_badge}>
                    <img src={badge.image_badge} alt={badge.titre_badge} />
                    <h3>{badge.titre_badge}</h3>
                    <p>{badge.description_badge}</p>
                </div>
            ))}
        </div>
    );
}