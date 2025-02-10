/* 
Tipos de indicadores:
   [uf, ivp, dolar, dolar_intercambio, euro, ipc, utm, imacec, tpm, libra_cobre, tasa_desempleo, bitcoin]
*/

let chartInstance = null;

async function obtenerIndicador() {
  const cantidad = document.getElementById("cantidad").value;
  const moneda = document.getElementById("moneda").value;
  const resultado = document.getElementById("resultado");
  const fechas = [];
  const valores = [];

  if (!cantidad) {
    resultado.innerHTML = "Por favor, ingrese una cantidad.";
    return;
  }

  try {
    const response = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!response.ok) {
      throw new Error(`Error al obtener la respuesta: ${response.status}`);
    }
    const data = await response.json();

    //console.log(data);
    const indicador = data.serie;
    //console.log(indicador);
    //console.log(indicador[0].valor);

    let tasa = indicador[0].valor;
    if (!tasa) {
      resultado.innerHTML = "Moneda no disponible.";
      return;
    }

    // Convertir y presentar resultado:
    const convertido = (cantidad / tasa).toFixed(2);
    resultado.innerHTML = `Resultado: ${convertido} ${moneda.toUpperCase()}`;

    // Graficar últimos 10 días
    for (let i = 9; i >= 0; i--) {
      fechas.push(indicador[i].fecha.substring(0, 10));
      valores.push(indicador[i].valor);
    }
    //console.log(fechas);
    //console.log(valores);

    mostrarGrafico(fechas, valores, moneda);

    //return indicador;
  } catch (error) {
    console.error("Error al obtener el indicador:", error.message);
    return null;
  }
}

function mostrarGrafico(fechas, valores, moneda) {
  const ctx = document.getElementById("chart").getContext("2d");

  // Limpia gráfico
  if (chartInstance) {
    chartInstance.destroy();
  }

  let periodo = ["ipc", "imacec", "tasa_empleo"].includes(moneda)
    ? "meses"
    : "días";

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: `Valor de ${moneda.toUpperCase()} en los últimos 10 ${periodo} registrados`,
          data: valores,
          borderColor: "rgba(29, 14, 240, 0.7)",
          backgroundColor: "rgba(0, 191, 255, 0.2)",
          fill: true,
        },
      ],
    },
  });
}
