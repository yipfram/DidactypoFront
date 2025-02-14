import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import Loading from '../Components/Loading';
import HoverText from '../Components/HoverText';
import style from './MembresClasse.module.css';
import icone from '../../img/IconCompte.png';

export default function MembresClasse({ idClasse }) {
    const [membres, setMembres] = useState([]);
    const [infoByPseudo, setInfoByPseudo] = useState({});
    const [loadingMembres, setLoadingMembres] = useState(true);

    const [professeurs, setProfesseurs] = useState([]);
    const [loadingProfesseurs, setLoadingProfesseurs] = useState(true);

    async function fetchInfosEleve(pseudo) {
        try {
            const reponseInfosEleve = await api.get(`/utilisateurs/${pseudo}`);
            const { nom, prenom } = reponseInfosEleve.data;
            return `${nom} ${prenom}`;
        } catch (error) {
            return "Erreur de chargement";
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
        if (idClasse) {
            fetchMembreClasse();
            fetchProfesseurs();
        }
    }, [idClasse]);

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
                                {membre.pseudo}
                            </li>
                        </HoverText>
                    ))
                ) : (
                    <p>Aucun membre trouvé.</p>
                )}
            </ul>
        </div>
    );
}
