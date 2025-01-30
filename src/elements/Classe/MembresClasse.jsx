import React, { useEffect, useState } from 'react';

import api from '../../api';

import Loading from '../Components/Loading';
import HoverText from '../Components/HoverText';

import style from './MembresClasse.module.css';
import icone from '../../img/IconCompte.png';

export default function MembresClasse({ idClasse }) {
    const [membres, setMembres] = useState([]);
    const [infoByPseudo, setInfoByPseudo] = useState({});
    const [loadingMembres, setLoadingMembres] = useState(true);

    async function fetchInfosEleve(pseudo) {
        try {
            const reponseInfosEleve = await api.get(`/utilisateurs/${pseudo}`);
            const { nom, prenom } = reponseInfosEleve.data; // Extract nom and prenom
            return `${nom} ${prenom}`; // Concatenate nom and prenom
        } catch (error) {
            return "Erreur de chargement"; // Message par défaut en cas d'erreur
        }
    }    

    // Récupération des membres de la classe et leurs infos
    useEffect(() => {
        if (idClasse) {
            const fetchMembreClasse = async () => {
                try {
                    // Récupérer la liste des membres
                    const reponseMembreClasse = await api.get(`/membre_classe_par_groupe/${idClasse}`);
                    const membresData = reponseMembreClasse.data;
                    setMembres(membresData);

                    // Charger les infos des membres
                    const infoFetchPromises = membresData.map(async (membre) => {
                        const info = await fetchInfosEleve(membre.pseudo);
                        return { pseudo: membre.pseudo, info };
                    });

                    const fetchedInfos = await Promise.all(infoFetchPromises);
                    const infoMap = fetchedInfos.reduce((acc, { pseudo, info }) => {
                        acc[pseudo] = info;
                        return acc;
                    }, {});
                    setInfoByPseudo(infoMap);
                } catch (error) {
                } finally {
                    setLoadingMembres(false);
                }
            };

            fetchMembreClasse();
        }
    }, [idClasse]);

    return (
        <div>
            <h2>Membres</h2>
            <ul className={style.listeEleve}>
                {loadingMembres ? (
                    <Loading />
                ) : membres.length ? (
                    membres.map((membre) => (
                        <HoverText key={membre.pseudo} text={infoByPseudo[membre.pseudo] || 'Chargement...'}>
                            <li className={style.eleve} onClick={() => {window.location.href=`/profil/${membre.pseudo}`}}>
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
