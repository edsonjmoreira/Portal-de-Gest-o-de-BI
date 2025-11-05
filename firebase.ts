
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// IMPORTANTE: Substitua com a configuração do seu projeto Firebase.
// Crie um arquivo .env.local na raiz do seu projeto e adicione suas chaves.
// Exemplo: VITE_FIREBASE_API_KEY="sua-chave-aqui"
// FIX: Cast import.meta to any to resolve environment variable type errors due to a misconfigured TypeScript environment.
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DATABASE_URL,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém uma referência para o serviço de banco de dados
export const db = getDatabase(app);
