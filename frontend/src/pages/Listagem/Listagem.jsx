import { useEffect, useState } from "react";
import { getUser } from "../../services/api";
import { db } from "../../db"; // seu Dexie
import "./Listagem.css";

export default function Listagem() {
  const [acessos, setAcessos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [loading, setLoading] = useState(true); // Estado de loading
  const itensPorPagina = 15; // Quantidade de itens por página

  useEffect(() => {
    const carregarAcessos = async () => {
      setLoading(true);
      try {
        // tenta pegar do backend
        const res = await getUser();
        setAcessos(res.data);

        // opcional: atualiza IndexedDB para sincronização
        try {
          await db.acessos.clear();
          const promises = res.data.map(item => 
            db.acessos.add({ ...item, sincronizado: true })
          );
          await Promise.all(promises);
        } catch (dbError) {
          console.warn('Erro ao salvar no IndexedDB, continuando...', dbError);
        }
      } catch (err) {
        console.error('Erro ao carregar da API:', err);
        // se falhar, pega do banco local
        try {
          const dadosLocais = await db.acessos.toArray();
          setAcessos(dadosLocais);
        } catch (localError) {
          console.error('Erro ao carregar do IndexedDB:', localError);
          setAcessos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    carregarAcessos();
  }, []);

  // Função para extrair timestamp de qualquer formato de data do Firebase
  const extrairTimestamp = (data) => {
    if (!data) return 0;
    
    try {
      // Se for Timestamp do Firebase (com método toDate)
      if (data && typeof data === 'object' && typeof data.toDate === 'function') {
        return data.toDate().getTime();
      }
      // Se for Timestamp do Firebase (com seconds/nanoseconds)
      else if (data && typeof data === 'object' && 'seconds' in data) {
        return data.seconds * 1000 + (data.nanoseconds || 0) / 1000000;
      }
      // Se for Date object
      else if (data instanceof Date) {
        return data.getTime();
      }
      // Se for string ou número
      else {
        return new Date(data).getTime();
      }
    } catch (error) {
      console.error('Erro ao extrair timestamp:', data, error);
      return 0;
    }
  };

  // Ordenar acessos por data (mais recentes primeiro)
  const acessosOrdenados = [...acessos].sort((a, b) => {
    const timestampA = extrairTimestamp(a.newData || a.dataRegistro);
    const timestampB = extrairTimestamp(b.newData || b.dataRegistro);
    return timestampB - timestampA; // Ordem decrescente (mais recente primeiro)
  });

  const acessosFiltrados = acessosOrdenados.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // Calcular o índice de início e fim dos itens a serem exibidos na página atual
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina;
  const acessosParaExibir = acessosFiltrados.slice(indiceInicial, indiceFinal);

  // Funções para navegação entre páginas
  const proximaPagina = () => {
    if (paginaAtual < Math.ceil(acessosFiltrados.length / itensPorPagina)) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  // Resetar para página 1 quando filtrar
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro]);

  // Função otimizada para formatar data
  function formatarData(data) {
    if (!data) return "—";

    try {
      let dt;

      // Se for Timestamp do Firebase (com método toDate)
      if (data && typeof data === 'object' && typeof data.toDate === 'function') {
        dt = data.toDate();
      }
      // Se for Timestamp do Firebase (com seconds/nanoseconds)
      else if (data && typeof data === 'object' && 'seconds' in data) {
        dt = new Date(data.seconds * 1000 + (data.nanoseconds || 0) / 1000000);
      }
      // Se for Date object
      else if (data instanceof Date) {
        dt = data;
      }
      // Se for string ou número
      else {
        dt = new Date(data);
      }

      // Se ainda assim não for válido
      if (isNaN(dt.getTime())) {
        return "—";
      }

      // Formata para DD/MM/YYYY HH:mm
      return dt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

    } catch (error) {
      console.error('Erro ao formatar data:', data, error);
      return "—";
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="listagem-container">
        <div className="loading">Carregando acessos...</div>
      </div>
    );
  }

  return (
    <div className="listagem-container">
      <h2>Listagem de Acessos</h2>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="🔍 Buscar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <table className="tabela-acessos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Curso</th>
            <th>Período</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {acessosParaExibir.length > 0 ? (
            acessosParaExibir.map((a) => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{a.curso}</td>
                <td>{a.periodo}</td>
                <td>
                  {formatarData(a.newData || a.dataRegistro)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="sem-resultados">
                {acessos.length === 0 ? 'Nenhum acesso cadastrado.' : 'Nenhum acesso encontrado para o filtro.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de paginação */}
      <div className="paginacao-container">
        <button onClick={paginaAnterior} disabled={paginaAtual === 1}>
          Anterior
        </button>
        <span>{`Página ${paginaAtual} de ${Math.ceil(acessosFiltrados.length / itensPorPagina)}`}</span>
        <button
          onClick={proximaPagina}
          disabled={paginaAtual === Math.ceil(acessosFiltrados.length / itensPorPagina) || acessosFiltrados.length === 0}
        >
          Próxima
        </button>
        
        {/* Botão para popular dados de teste 
        <button 
          className="botao-teste"
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:3332/users/popular-teste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: 10 }) // Cria 10 usuários
              });
              const result = await response.json();
              console.log('Resultado:', result);
              // Recarrega a listagem
              window.location.reload();
            } catch (error) {
              console.error('Erro:', error);
              alert('Erro ao popular dados de teste');
            }
          }}
        >
          Popular 10 Usuários de TESTE
        </button>*/}
      </div>
    </div>
  );
}