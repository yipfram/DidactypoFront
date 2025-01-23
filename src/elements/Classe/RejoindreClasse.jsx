import { useState } from 'react';
import api from '../../api';

const RejoindreClasse = (props) => {
    const [idGroupe, setIdGroupe] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            // Send data as query parameters, not in the body
            const response = await api.post('/membre_classe/', null, {
                params: {
                    id_groupe: idGroupe,
                    pseudo_utilisateur: props.pseudo_utilisateur,
                    est_admin: false
                }
            });

            window.location.reload();
        } catch (error) {
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Numéro de la classe :</label>
                <input
                    type="number"
                    value={idGroupe}
                    onChange={(e) => setIdGroupe(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Rejoindre Classe</button>
        </form>
    );
};

export default RejoindreClasse;