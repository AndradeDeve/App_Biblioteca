import express from 'express';
import { listarUsuarios, registrarUsuario } from '../services/service.js';
const routes = express.Router();

routes.get('/search', async (req, res) => {
    try{
        const usuarios = await listarUsuarios();
        res.status(200).send(usuarios);

    }catch(err){
        console.error(err);
        res.status(500).send({error: 'Erro no servidor'});
    }
})

routes.post('/register', async (req, res) => {
    try{
        const { nome, curso, periodo } = req.body;
          
        const nomeRegex = /^[\p{L}\s\-']{2,50}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({err: "Nome inválido."});
        } 
        const newData = new Date().toISOString();
        if(!curso || !periodo) {
            return res.status(400).send({error: 'Todos os campos são obrigatórios'});
        }

        await registrarUsuario({ nome, curso, periodo, newData });
        res.status(201).send('Usuário registrado com sucesso');
    }catch (err) {
        console.error(err);
        res.status(500).send({error:'Erro no servidor'});   
    }
});


export default routes;