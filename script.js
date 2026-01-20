let dados = JSON.parse(localStorage.getItem("bianca_financeiro")) || [];

function salvar() {
  localStorage.setItem("bianca_financeiro", JSON.stringify(dados));
}

function adicionar() {
  if (!descricao.value || !valor.value) {
    alert("Preencha todos os campos");
    return;
  }

  dados.push({
    descricao: descricao.value,
    valor: +valor.value,
    mes: mes.value,
    ano: ano.value
  });

  descricao.value = "";
  valor.value = "";

  salvar();
  atualizar();
}

function atualizar() {
  lista.innerHTML = "";
  let totalGastosMes = 0;

  const salario = +salarioInput.value || +salario.value || 0;

  dados.forEach((g, i) => {
    if (g.mes === mes.value && g.ano == ano.value) {
      totalGastosMes += g.valor;

      lista.innerHTML += `
        <tr>
          <td>${g.descricao}</td>
          <td>R$ ${g.valor.toFixed(2)}</td>
          <td><button onclick="remover(${i})">❌</button></td>
        </tr>
      `;
    }
  });

  totalGastos.innerText = totalGastosMes.toFixed(2);

  const saldo = salario - totalGastosMes;
  saldoFinal.innerText = saldo.toFixed(2);
  saldoFinal.style.color = saldo < 0 ? "red" : "green";

  atualizarGrafico(salario, totalGastosMes, saldo);
}

function remover(index) {
  dados.splice(index, 1);
  salvar();
  atualizar();
}

// 📊 Gráfico
let grafico;
function atualizarGrafico(salario, gastos, saldo) {
  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("grafico"), {
    type: "bar",
    data: {
      labels: ["Salário", "Gastos", "Saldo"],
      datasets: [{
        data: [salario, gastos, saldo]
      }]
    }
  });
}

atualizar();
