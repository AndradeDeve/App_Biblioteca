import { db } from "./db";
import api from "./services/api";

export async function sincronizarDados() {
  const pendentes = await db.acessos.where("sincronizado").equals(false).toArray();

  for (const item of pendentes) {
    try {
      const res = await api.post("/acessos", item);
      if (res.status === 200) {
        await db.acessos.update(item.id, { sincronizado: true });
        console.log(`✅ Sincronizado: ${item.nome}`);
      }
    } catch (err) {
      console.warn(`❌ Falha ao sincronizar ${item.nome}`, err);
    }
  }
}

// detectar quando voltar online
window.addEventListener("online", () => {
  console.log("🔄 Voltou a internet, sincronizando...");
  sincronizarDados();
});
