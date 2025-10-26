import { useEffect, useState } from "react";
import { getUser } from "../../services/api";
import { Bar, Line } from "react-chartjs-2";
import { db } from "../../db"; // seu Dexie
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";

Chart.register(...registerables);

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [intervaloData, setIntervaloData] = useState('dia'); // Estado para o filtro de data (dia, semana, mês, semestre)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await getUser();
        setDados(res.data);

        // Salvar os dados no IndexedDB
        await db.acessos.clear(); // Limpa os dados existentes
        res.data.forEach(async (item) => {
          await db.acessos.put({ ...item, sincronizado: true }); // Usando put ao invés de add
        });
      } catch (err) {
        // Buscar dados locais se não conseguir carregar da API
        const dadosLocais = await db.acessos.toArray();
        setDados(dadosLocais);
      }
    };

    carregarDados();
  }, []);

  // Função para extrair data de qualquer formato do Firebase
  const extrairData = (acesso) => {
    // Tenta newData primeiro, depois dataRegistro
    const dataField = acesso.newData || acesso.dataRegistro;
    
    if (!dataField) return null;

    try {
      // Se for Timestamp do Firebase (com método toDate)
      if (dataField && typeof dataField === 'object' && typeof dataField.toDate === 'function') {
        return dataField.toDate();
      }
      // Se for Timestamp do Firebase (com seconds/nanoseconds)
      else if (dataField && typeof dataField === 'object' && 'seconds' in dataField) {
        return new Date(dataField.seconds * 1000 + (dataField.nanoseconds || 0) / 1000000);
      }
      // Se for Date object
      else if (dataField instanceof Date) {
        return dataField;
      }
      // Se for string ou número
      else {
        return new Date(dataField);
      }
    } catch (error) {
      console.error('Erro ao extrair data:', dataField, error);
      return null;
    }
  };

  // Processar dados para os gráficos
  const cursos = [...new Set(dados.map((d) => d.curso))];
  const contagensCursos = cursos.map(
    (c) => dados.filter((d) => d.curso === c).length
  );

  const periodos = ["Manhã", "Tarde", "Noite"];
  const contagensPeriodos = periodos.map(
    (p) => dados.filter((d) => d.periodo === p).length
  );

  // Funções auxiliares para agrupamento por dia, semana, mês e semestre
  const formatarDataParaGrupo = (data, intervalo) => {
    if (!data || isNaN(data.getTime())) {
      return null;
    }

    const date = new Date(data);
    
    switch (intervalo) {
      case 'dia':
        return date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
      
      case 'semana':
        // Primeiro dia da semana (domingo)
        const firstDayOfWeek = new Date(date);
        firstDayOfWeek.setDate(date.getDate() - date.getDay());
        return firstDayOfWeek.toISOString().split('T')[0];
      
      case 'mes':
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // 'YYYY-MM'
      
      case 'semestre':
        const semestre = date.getMonth() < 6 ? '1' : '2';
        return `${date.getFullYear()}-S${semestre}`;
      
      default:
        return date.toISOString().split('T')[0];
    }
  };

  // Função para gerar os gráficos de data (por dia, semana, mês ou semestre)
  const renderGraficoData = () => {
    console.log('📊 Processando dados para gráfico de data, intervalo:', intervaloData);
    
    let dadosFiltrados = dados.reduce((acc, acesso) => {
      const dataObj = extrairData(acesso);
      
      if (!dataObj || isNaN(dataObj.getTime())) {
        console.log('❌ Data inválida para acesso:', acesso);
        return acc;
      }

      const dataFormatada = formatarDataParaGrupo(dataObj, intervaloData);
      
      if (dataFormatada) {
        acc[dataFormatada] = (acc[dataFormatada] || 0) + 1;
      }
      
      return acc;
    }, {});

    console.log('📈 Dados agrupados:', dadosFiltrados);

    // Ordenar as datas para exibição correta no gráfico
    const labelsOrdenadas = Object.keys(dadosFiltrados).sort();
    const dadosOrdenados = labelsOrdenadas.map(label => dadosFiltrados[label]);

    // Formatar labels para exibição mais amigável
    const labelsFormatadas = labelsOrdenadas.map(label => {
      if (intervaloData === 'mes') {
        const [ano, mes] = label.split('-');
        return `${mes}/${ano}`;
      } else if (intervaloData === 'semestre') {
        const [ano, semestre] = label.split('-S');
        return `${semestre}º Sem/${ano}`;
      } else if (intervaloData === 'semana') {
        const date = new Date(label);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else {
        // dia
        const date = new Date(label);
        return date.toLocaleDateString('pt-BR');
      }
    });

    return (
      <Line
        data={{
          labels: labelsFormatadas,
          datasets: [
            {
              label: `Acessos por ${intervaloData === 'dia' ? 'Dia' : intervaloData === 'semana' ? 'Semana' : intervaloData === 'mes' ? 'Mês' : 'Semestre'}`,
              data: dadosOrdenados,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(75, 192, 192)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                title: (context) => {
                  return `Período: ${context[0].label}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              },
              title: {
                display: true,
                text: 'Quantidade de Acessos'
              }
            },
            x: {
              title: {
                display: true,
                text: intervaloData === 'dia' ? 'Dias' : 
                      intervaloData === 'semana' ? 'Semanas' : 
                      intervaloData === 'mes' ? 'Meses' : 'Semestres'
              }
            }
          },
        }}
      />
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Container para os gráficos lado a lado */}
      <div className="graficos-flex-container">
        {/* Gráfico de Acessos por Data (com Filtro de Intervalo) */}
        <div className="grafico-container">
          <h3>Acessos por Período de Tempo</h3>
          {/* Filtro de Data */}
          <div className="filtro-container">
            <label>Agrupar por: </label>
            <select
              value={intervaloData}
              onChange={(e) => setIntervaloData(e.target.value)}
            >
              <option value="dia">Dia</option>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="semestre">Semestre</option>
            </select>
          </div>
          {renderGraficoData()}
        </div>

        {/* Gráfico de Acessos por Período */}
        <div className="grafico-container">
          <h3>Acessos por Período do Dia</h3>
          <Bar
            data={{
              labels: periodos,
              datasets: [
                {
                  label: "Acessos por período",
                  data: contagensPeriodos,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)", 
                    "rgba(255, 206, 86, 0.6)"
                  ],
                  borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 206, 86)"
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { 
                legend: { 
                  position: "top",
                  display: false
                } 
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Gráfico de Acessos por Curso (em linha única abaixo) */}
      <div className="grafico-container linha-grafico">
        <h3>Acessos por Curso</h3>
        <Bar
          data={{
            labels: cursos,
            datasets: [
              {
                label: "Acessos por curso",
                data: contagensCursos,
                backgroundColor: "rgba(25, 182, 210, 0.6)",
                borderColor: "rgba(25, 182, 210, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { 
              legend: { 
                position: "top",
                display: false
              } 
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }}
        />
      </div>

      {/* Estatísticas rápidas */}
      <div className="estatisticas-rapidas">
        <div className="grafico-container">
          <h4>Total de Acessos</h4>
          <span className="numero">{dados.length}</span>
        </div>
        <div className="grafico-container">
          <h4>Cursos Diferentes</h4>
          <span className="numero">{cursos.length}</span>
        </div>
        <div className="grafico-container">
          <h4>Período Mais Popular</h4>
          <span className="numero">
            {periodos[contagensPeriodos.indexOf(Math.max(...contagensPeriodos))]}
          </span>
        </div>
      </div>
    </div>
  );
}