import { db } from '../config/firebaseConfig.js'
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function registrarUsuario(dados) {
  const ref = collection(db, "entradas");
  await addDoc(ref, dados);
}

export async function listarUsuarios() {
  const ref = collection(db, "entradas");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}