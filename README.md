# 🌐 MERN-APP: Fullstack Mern Web App

Stack: MongoDB - Express.js - React (Vite) - Node.js

Questa applicazione è un blog completo che utilizza React per il frontend e Node.js con Express per il backend. Permette agli utenti di visualizzare, creare e interagire con i post del blog.

## 🚀 Funzionalità

- Visualizzazione dei post del blog
- Creazione di nuovi post
- Modifica e cancellazione dei post (solo per l'autore)
- Aggiunta di commenti ai post
- Autenticazione degli utenti

## 🛠️ Setup/Installazione

1. Clona questa repository.
2. Installa le dipendenze per frontend e backend:


```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Configura il file `.env` nel frontend e nel backend

4. Avvia il backend:
- Avvia il backend: cd backend && npm start
- Avvia il frontend: cd frontend && npm run dev


## 📂 Struttura del Progetto

### Backend

- **Modelli**: Definizione degli schemi MongoDB per i post e i commenti.
- **Rotte**: Gestione delle API per i post e i commenti.
- **Middleware**: Funzioni di middleware per l'autenticazione e il controllo delle email.
- **Servizi**: Servizi per l'invio di email.

### Frontend

- **Pagine**: Componenti React per le diverse pagine dell'applicazione (Home, PostDetail, Login, ecc.).
- **Componenti**: Componenti riutilizzabili come `SinglePost`, `CommentArea`, ecc.
- **Servizi**: Funzioni per effettuare chiamate API al backend.


## 🔒 Autenticazione

L'autenticazione degli utenti è gestita tramite token JWT. Il token viene salvato nel localStorage del browser e viene utilizzato per autenticare le richieste API.



---

Grazie per aver utilizzato l'applicazione! 🎉
