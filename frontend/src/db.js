import Dexie from "dexie";

export const db = new Dexie("localDatabase");

db.version(1).stores({
  acessos: "++id,nome,curso,periodo,data,sincronizado"
});
