import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import style from "./Header.module.css";

import logo from "../../img/logoDidactypo.png";
import iconCompte from "../../img/IconCompte.png";
import { getPseudo, api } from "../../api";

export default function Header() {
    const [pseudo, setPseudo] = useState("Se connecter");
    const [photoUtilisateur, setPhotoUtilisateur] = useState(null);

    const fetchPdp = async (pseudo) => {
        try {
            const reponse = await api.get(`/utilisateurPdp/${pseudo}`);
            console.log("Réponse utilisateurPdp:", reponse.data);

            if (reponse) {
                const id_photo = reponse.data.pdpActuelle;
                if (id_photo) {
                    const reponsePdp = await api.get(`/photo_profil/${id_photo}`);
                    console.log("Réponse photo_profil:", reponsePdp.data);
                    setPhotoUtilisateur(reponsePdp.data.chemin_image);
                } else {
                    console.warn("Aucune photo de profil trouvée pour", pseudo);
                    setPhotoUtilisateur(iconCompte);
                }
            }

        } catch (error) {
            console.error("Erreur lors de la récupération de la photo de profil", error);
        }
    };


    useEffect(() => {
        const userPseudo = getPseudo();
        if (userPseudo) {
            setPseudo(userPseudo);
            fetchPdp(userPseudo);
        } else {
            setPseudo("Se connecter");
            setPhotoUtilisateur(iconCompte)
        }

    }, []);


    return (
        <div className={style.header}>
            <Link to="/">
                <img src={logo} alt="logo" className={style.logo} />
            </Link>
            <nav>
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/apprendre">Apprendre</NavLink>
                <NavLink to="/competition">Competition</NavLink>
                <NavLink to="/classe">Ma Classe</NavLink>
                <NavLink to="/infos">Infos utiles</NavLink>
            </nav>
            <NavLink to={`/profil/${pseudo}`} className={({ isActive }) => isActive ? style.active : ""}>
                <p>{pseudo}</p>
                <img src={photoUtilisateur} alt="compte" className={style.iconCompte} />
            </NavLink>
        </div>
    )
}