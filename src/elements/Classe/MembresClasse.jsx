import React, { useEffect, useState } from 'react';
import { api, getPseudo } from '../../api';
import Loading from '../Components/Loading';
import HoverText from '../Components/HoverText';
import style from './MembresClasse.module.css';
import icone from '../../img/IconCompte.png';

export default function MembresClasse({ idClasse }) {
    const [isAdmin, setIsAdmin] = useState(false)

    const [membres, setMembres] = useState([]);
    const [infoByPseudo, setInfoByPseudo] = useState({});
    const [loadingMembres, setLoadingMembres] = useState(true);

    const [professeurs, setProfesseurs] = useState([]);
    const [loadingProfesseurs, setLoadingProfesseurs] = useState(true);

    const checkIfAdmin = async () => {
        try {
            const response = await api.get(`/membre_est_admin/${idClasse}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsAdmin(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Erreur pendant la vérification de l'admin :", error);
        }
    };

    async function fetchInfosEleve(pseudo) {
        try {
            const reponseInfosEleve = await api.get(`/utilisateur/${pseudo}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const { nom, prenom } = reponseInfosEleve.data;
            return `${nom} ${prenom}`;
        } catch (error) {
            console.error(error);
        }
    }

    async function setInfosEleves(data) {
        try {
            const infoFetchPromises = data.map(async (membre) => {
                const info = await fetchInfosEleve(membre.pseudo);
                return { pseudo: membre.pseudo, info };
            });

            return await Promise.all(infoFetchPromises); // Ajout de `await`
        } catch (e) {
            console.error("Erreur pour set les infos :", e);
            return [];
        }
    }

    // Récupération des membres de la classe et leurs infos
    const fetchMembreClasse = async () => {
        try {
            const reponseMembreClasse = await api.get(`/membre_classe_par_groupe/${idClasse}`);
            const membresData = reponseMembreClasse.data;
            setMembres(membresData);

            const fetchedInfos = await setInfosEleves(membresData); // Utilisation correcte de `membresData`
            const infoMap = fetchedInfos.reduce((acc, { pseudo, info }) => {
                acc[pseudo] = info;
                return acc;
            }, {});
            setInfoByPseudo(prevInfoByPseudo => ({ ...prevInfoByPseudo, ...infoMap }));
        } catch (error) {
            console.error("Erreur pendant le fetch membres :", error);
        } finally {
            setLoadingMembres(false);
        }
    };

    // Récupération des professeurs et de leurs infos
    const fetchProfesseurs = async () => {
        try {
            const reponseProfs = await api.get(`/admins_par_groupe/${idClasse}`);
            const profData = reponseProfs.data;
            setProfesseurs(profData);

            const fetchedInfos = await setInfosEleves(profData); // Utilisation correcte de `profData`
            const infoMap = fetchedInfos.reduce((acc, { pseudo, info }) => {
                acc[pseudo] = info;
                return acc;
            }, {});

            setInfoByPseudo(prevInfoByPseudo => ({ ...prevInfoByPseudo, ...infoMap }));
        } catch (e) {
            console.error("Erreur pendant le fetch prof :", e);
        } finally {
            setLoadingProfesseurs(false);
        }
    };

    useEffect(() => {
        checkIfAdmin();

    }, [idClasse])

    useEffect(() => {
        if (idClasse) {
            fetchMembreClasse();
            fetchProfesseurs();
        }
    }, [isAdmin]);

    async function toggleAdmin(isAdmin, pseudo) {
        try {
            console.log("Les paramètres : ", isAdmin, pseudo, idClasse);
            const response = await api.patch('/admin_classe/', null, {
                params: {
                    id_groupe: idClasse,
                    pseudo_utilisateur: pseudo,
                    est_admin: isAdmin
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            // Optionally, you can refresh the members and professors list
            fetchMembreClasse();
            fetchProfesseurs();
        } catch (error) {
            console.error("Erreur pendant la modification de l'admin :", error);
        }
    }

    return (
        <div>
            <h2>Professeurs</h2>
            <ul className={style.listeEleve}>
                {loadingProfesseurs ? (
                    <Loading />
                ) : professeurs.length ? (
                    professeurs.map((prof) => (
                        <HoverText key={prof.pseudo} text={infoByPseudo[prof.pseudo] || 'Chargement...'}>
                            <li className={style.eleve} onClick={() => { window.location.href = `/profil/${prof.pseudo}` }}>
                                <span>
                                    <img className={style.icone} src={icone} alt="icone" />
                                </span>
                                {prof.pseudo}
                            </li>
                            {(isAdmin && prof.pseudo !== getPseudo()) ? (
                                    <button onClick={() => toggleAdmin(false, prof.pseudo)} >Unset admin</button>
                                ) : null
                                }
                        </HoverText>
                    ))
                ) : (
                    <p>Aucun professeur pour cette classe</p>
                )}
            </ul>

            <h2>Membres</h2>
            <ul className={style.listeEleve}>
                {loadingMembres ? (
                    <Loading />
                ) : membres.length ? (
                    membres.map((membre) => (
                        <HoverText key={membre.pseudo} text={infoByPseudo[membre.pseudo] || 'Chargement...'}>
                            <li className={style.eleve} onClick={() => { window.location.href = `/profil/${membre.pseudo}` }}>
                                <span>
                                    <img className={style.icone} src={icone} alt="icone" />
                                </span>
                                <p>{membre.pseudo}</p>
                            </li>
                            {isAdmin ? (
                                    <button onClick={() => toggleAdmin(true, membre.pseudo)} >Set admin</button>
                                ) : null
                                }
                        </HoverText>
                    ))
                ) : (
                    <p>Aucun membre trouvé.</p>
                )}
            </ul>
        </div>
    );
}
