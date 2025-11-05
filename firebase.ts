import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// IMPORTANTE: Substitua com a configuração do seu projeto Firebase.
// Crie um arquivo .env.local na raiz do seu projeto e adicione suas chaves.
// Exemplo: VITE_FIREBASE_API_KEY="sua-chave-aqui"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém uma referência para o serviço de banco de dados
export const db = getDatabase(app);
