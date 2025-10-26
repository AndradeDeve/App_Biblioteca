import express from 'express';
import { listarUsuarios, registrarUsuario } from '../services/service.js';

const routes = express.Router();

routes.post('/popular-teste', async (req, res) => {
  try {
    const { quantidade = 10 } = req.body;
    const cursos = [
      'Redes de Computadores (Ensino médio)',
      'Automação Industrial (Ensino Médio)', 
      'Administração (Ensino médio)',
      'Informática',
      'Administração',
      'Recursos Humanos',
      'Contabilidade',
      'Desenvolvimento de Sistemas',
      'Eletroeletrônica'
    ];
    
    const periodos = ['Manhã', 'Tarde', 'Noite'];
    const nomes = ['teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste', 'teeeeste'];

    const usuariosCriados = [];

    for (let i = 0; i < quantidade; i++) {
      const nome = `${nomes[i % nomes.length]} Silva ${i + 1}`;
      const curso = cursos[i % cursos.length];
      const periodo = periodos[i % periodos.length];
      
      // Cria data variada - Firebase usa Timestamp
      const dataBase = new Date('2025-01-01T08:00:00');
      dataBase.setDate(dataBase.getDate() + i);
      dataBase.setHours(dataBase.getHours() + (i % 8));

      const usuario = {
        nome: nome,
        curso: curso,
        periodo: periodo,
        dataRegistro: dataBase, // Pode ser Date object
        newData: dataBase, // Pode ser Date object
        // Ou se quiser ser explícito:
        // dataRegistro: Timestamp.fromDate(dataBase),
        // newData: Timestamp.fromDate(dataBase)
      };

      console.log(`👤 Criando usuário ${i + 1}:`, usuario);
      
      await registrarUsuario(usuario);
      usuariosCriados.push(usuario);
    }

    res.json({ 
      message: `${quantidade} usuários de teste criados com sucesso!`,
      usuarios: usuariosCriados 
    });
  } catch (err) {
    console.error('❌ Erro ao popular dados de teste:', err);
    res.status(500).json({ err: 'Erro ao popular dados de teste' });
  }
});

routes.get('/search', async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).send(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro no servidor' });
    }
});

const cursosM = [
    "Redes de Computadores (Ensino médio)",
    "Automação Industrial (Ensino Médio)",
    "Administração (Ensino médio)"
];
const cursosT = [
    "Automação Industrial (Ensino Médio)",
    "Informática"
];
const cursosN = [
    "Administração",
    "Recursos Humanos",
    "Contabilidade",
    "Desenvolvimento de Sistemas",
    "Eletroeletrônica",
    "Desenvolvimento de Sistemas (Ensino médio)"
];

routes.post('/register', async (req, res) => {
    try {
        const { nome, curso, periodo } = req.body;

        // Validações de curso por período
        if (periodo === "Manhã" && !cursosM.includes(curso)) {
            return res.status(400).json({ err: 'Curso inválido para o período da manhã' });
        }
        if (periodo === "Tarde" && !cursosT.includes(curso)) {
            return res.status(400).json({ err: 'Curso inválido para o período da tarde' });
        }
        if (periodo === "Noite" && !cursosN.includes(curso)) {
            return res.status(400).json({ err: 'Curso inválido para o período da noite' });
        }

        // Validação de nome
        const nomeRegex = /^[\p{L}\s\-']{2,50}$/u;
        if (!nome || !nomeRegex.test(nome.trim())) {
            return res.status(400).json({ err: "Nome inválido." });
        }

        // Verificação de campos obrigatórios
        if (!curso || !periodo) {
            return res.status(400).json({ err: 'Todos os campos são obrigatórios' });
        }

        const newData = new Date().toISOString();
        await registrarUsuario({ nome, curso, periodo, newData });
        res.status(201).json({ message: 'Usuário registrado com sucesso' });  // Use JSON para consistência
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Erro no servidor' });
    }
});













export default routes;