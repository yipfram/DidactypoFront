import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api";
import style from "../style/BadgesInfos.module.css";
import icone from "../img/IconCompte.png";

import Loading from "../elements/Components/Loading";

export default function BadgeInfo() {
    const { badgeId } = useParams();
    const [loadingUtilisateurs, setLoadingUtilisateurs] = useState(false);
    const [badge, setBadge] = useState({
        titre_badge: "Chargement...",
        image_badge: "/BadgesDidactypo/hidden.png",
        description_badge: "Chargement des informations...",
    });
    const [utilisateurs, setUtilisateurs] = useState([]);

    // Fetch badge information
    const badgeInfo = async () => {
        try {
            const response = await api.get(`/badge_manquant/${badgeId}`);
            setBadge(response.data);
        } catch {
            setBadge({
                titre_badge: "Badge inexistant",
                image_badge: "/BadgesDidactypo/hidden.png",
                description_badge: "Ce badge n&apos;existe pas",
            });
        }
    };

    // Fetch users who have this badge
    const badgeUsers = async () => {
        try {
            setLoadingUtilisateurs(true);
            const response = await api.get(`/badge_membres/${badgeId}`);
            setUtilisateurs(response.data);
        } catch {
            setUtilisateurs([]); // ✅ Ensure state reset on error
        } finally {
            setLoadingUtilisateurs(false);
        }
    };

    useEffect(() => {
        if (!badgeId) return;

        badgeInfo();
        badgeUsers();
    }, [badgeId]);

    return (
        <main className={style.badgeInfoContainer}>
            <div className={style.badgeInfo}>
                <img src={badge.image_badge} alt={badge.titre_badge} />
                <div>
                    <h1>{badge.titre_badge}</h1>
                    <p>{badge.description_badge}</p>
                </div>

            </div>
            <div className={style.badgeUsers}>
                <h2>Utilisateurs ayant ce badge</h2>
                <ul className={style.listeEleve}>
                    {loadingUtilisateurs ? (
                        <Loading />
                    ) : utilisateurs.length > 0 ? (
                        utilisateurs.map((utilisateur) => (
                            <li
                                key={utilisateur.pseudo}
                                className={style.eleve}
                                onClick={() => window.location.href = `/profil/${utilisateur.pseudo}`}
                            >
                                <span>
                                    <img className={style.icone} src={icone} alt="icone utilisateur" />
                                </span>
                                <p>{utilisateur.pseudo}</p>
                            </li>
                        ))
                    ) : (
                        <p>Personne n&apos;a eu ce badge pour le moment !</p>
                    )}
                </ul>
            </div>
        </main>
    );
}
