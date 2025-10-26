import { useState } from "react";
import { postUser } from "../../services/api.js";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../db"; 
import "./Cadastro.css";
import '../toast/toast.css'

export default function Cadastro() {
  const [form, setForm] = useState({ nome: "", curso: "", periodo: "" });

  const cursosDisponiveis = [
    "Redes de Computadores (Ensino médio)",
    "Desenvolvimento de Sistemas (Ensino médio)",
    "Automação Industrial (Ensino Médio)",
    "Administração",
    "Recursos Humanos",
    "Contabilidade",
    "Administração (Ensino médio)",
    "Desenvolvimento de Sistemas",
    "Redes de Computadores",
    "Informática",
    "Eletroeletrônica"
  ];
  const periodosDisponiveis = ["Manhã", "Tarde", "Noite"];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoAcesso = {
      ...form,
      data: new Date() 
    };

    try {
      // Enviar para o backend
      const response = await postUser(form);

      // Verificar resposta do backend
      if (response && response.status === 201) {
        // Salvar no IndexedDB local (opcional: could be moved before/after depending on desired behavior)
        await db.acessos.add(novoAcesso);

        toast.success("Acesso registrado com sucesso!");
        console.log("Usuário registrado com sucesso");

        // Limpar formulário
        setForm({ nome: "", curso: "", periodo: "" });
        return;
      }

      // Tratamento de erros retornados pelo backend (axios errors return err.response)
      if (response && (response.status === 400 || response.status === 407)) {
        const msg = (response.data && (response.data.err || response.data.response || response.data.message)) || 'Erro ao registrar';
        toast.warn(msg);
        console.error("Erro ao registrar usuário:", msg);
        return;
      }

      // Outros casos (incluindo status 0 = network error fallback)
      const fallbackMsg = (response && response.data && (response.data.err || response.data.message || response.data.response)) || 'Erro desconhecido ao registrar';
      toast.error(fallbackMsg);
      console.error('Resposta inesperada do servidor:', response);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar acesso!");
    }
  };


  return (
    <div className="cadastro-container">
      <h2>Registrar Acesso</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <select name="curso" value={form.curso} onChange={handleChange} required>
          <option value="">Selecione o curso</option>
          {cursosDisponiveis.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="periodo" value={form.periodo} onChange={handleChange} required>
          <option value="">Selecione o período</option>
          {periodosDisponiveis.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button type="submit">Registrar</button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
