import axios from 'axios';

const url = 'http://localhost:3332'; 

export async function getUser(){
  const response = await axios.get(`${url}/users/search`);
  return response;
}

export async function postUser(dados){
  try {
    console.log('Enviando dados:', dados);
    const response = await axios.post(`${url}/users/register`, dados);
    console.log('Resposta recebida:', response);
    return response;
  } catch (err) {
    // If the server responded with an error status, axios puts it on err.response
    if (err && err.response) {
      console.warn('Falha na requisição com status:', err.response.status, err.response.data);
      return err.response;
    }

    return { status: 0, data: { err: err.message || 'Erro de conexão' } };
  }
}
