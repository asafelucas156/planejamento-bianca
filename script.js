let gastos = JSON.parse(localStorage.getItem("gastos_bianca")) || [];

function salvar() {
  localStorage.setItem("gastos_bianca", JSON.stringify(gastos));
}

function adicionar() {
  const descricao = document.getElementById("descricao").value;
  const valor = document.getElementById("valor").value;

  if (!descricao || !valor) {
    alert("Preencha todos os campos");
    return;
  }

  gastos.push({
    descricao,
    valor: Number(valor),
    mes: document.getElementById("mes").value,
    ano: document.getElementById("ano").value
  });

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";

  salvar();
  atualizar();
}

function atualizar() {
  const mes = document.getElementById("mes").value;
  const ano = document.getElementById("ano").value;
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  gastos.forEach((g, i) => {
    if (g.mes === mes && g.ano == ano) {
      total += g.valor;
      lista.innerHTML += `
        <tr>
          <td>${g.descricao}</td>
          <td>R$ ${g.valor.toFixed(2)}</td>
          <td><button onclick="remover(${i})">❌</button></td>
        </tr>
      `;
    }
  });

  document.getElementById("totalMes").innerText = total.toFixed(2);
  atualizarGrafico(total);
}

function remover(index) {
  gastos.splice(index, 1);
  salvar();
  atualizar();
}

// 📊 Gráfico simples
let grafico;
function atualizarGrafico(total) {
  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("grafico"), {
    type: "doughnut",
    data: {
      labels: ["Total Gasto"],
      datasets: [{
        data: [total]
      }]
    }
  });
}

atualizar();
