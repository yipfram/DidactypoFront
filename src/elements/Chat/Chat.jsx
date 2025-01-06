import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';
import style from './Chat.module.css';

export default function Chat(props) {
    const { class_id, utilisateur } = props;

    const [newMessage, setNewMessage] = useState('');
    const messagesRef = collection(db, "messages");
    const [messagesList, setMessagesList] = useState([]);

    useEffect(() => {
        const queryMessages = query(messagesRef, where("class_id", "==", class_id), orderBy("date_envoi"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            console.log("LOU Y'A UN NOUVEAU MESSAGE");
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id })
            });
            setMessagesList(messages);
        });

        return () => unsubscribe();
    }, [class_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;  // Empêche d'envoyer des messages vides

        await addDoc(messagesRef, {
            text: newMessage,
            date_envoi: serverTimestamp(),
            utilisateur: utilisateur,
            class_id: class_id
        });
        setNewMessage('');
    }

    return (
        <div className={style.chat}>
            <div>
                {messagesList.map((message) => (
                    <div key={message.id}>
                        <p className={style.pseudo}>{message.utilisateur} :</p> {/* Pseudo utilisateur */}
                        <p className={style.texte}>{message.text}</p> {/* Contenu du message */}
                        <p className={style.date}>{new Date(message.date_envoi?.seconds * 1000).toLocaleString()}</p> {/* Date du message */}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Saisissez votre message..."
                    value={newMessage}
                    aria-label="Message Input" // Add an accessible label
                />
                <button type="submit" disabled={!newMessage.trim()}>Envoyer</button> {/* Disable button when empty */}
            </form>
        </div>
    )
}
