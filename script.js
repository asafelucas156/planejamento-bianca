let dados = JSON.parse(localStorage.getItem("bianca_financeiro")) || [];

function salvar() {
  localStorage.setItem("bianca_financeiro", JSON.stringify(dados));
}

function adicionar() {
  const descricao = document.getElementById("descricao").value;
  const valor = document.getElementById("valor").value;

  if (!descricao || !valor) {
    alert("Preencha descrição e valor");
    return;
  }

  dados.push({
    descricao: descricao,
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
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const salario = Number(document.getElementById("salario").value) || 0;
  let total = 0;

  dados.forEach((g, i) => {
    if (
      g.mes === document.getElementById("mes").value &&
      g.ano == document.getElementById("ano").value
    ) {
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

  document.getElementById("totalGastos").innerText = total.toFixed(2);

  const saldo = salario - total;
  const saldoEl = document.getElementById("saldoFinal");
  saldoEl.innerText = saldo.toFixed(2);
  saldoEl.style.color = saldo < 0 ? "red" : "green";

  atualizarGrafico(salario, total, saldo);
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

// 📊 Exportar Excel
function exportarExcel() {
  const salario = Number(document.getElementById("salario").value) || 0;
  let total = 0;

  const linhas = [
    ["Planejamento Financeiro - Bianca"],
    [`Mês: ${mes.value}/${ano.value}`],
    [],
    ["Descrição", "Valor"]
  ];

  dados.forEach(g => {
    if (g.mes === mes.value && g.ano == ano.value) {
      linhas.push([g.descricao, g.valor]);
      total += g.valor;
    }
  });

  linhas.push([]);
  linhas.push(["Total de Gastos", total]);
  linhas.push(["Salário", salario]);
  linhas.push(["Saldo Final", salario - total]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(linhas);
  XLSX.utils.book_append_sheet(wb, ws, "Financeiro");

  XLSX.writeFile(
    wb,
    `Financeiro_Bianca_${mes.value}_${ano.value}.xlsx`
  );
}

atualizar();
