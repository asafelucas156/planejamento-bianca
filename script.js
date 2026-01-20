let dados = JSON.parse(localStorage.getItem("bianca_financeiro")) || [];
let salarios = JSON.parse(localStorage.getItem("bianca_salarios")) || {};

function salvar() {
  localStorage.setItem("bianca_financeiro", JSON.stringify(dados));
  localStorage.setItem("bianca_salarios", JSON.stringify(salarios));
}

// 👉 Salva salário por mês/ano
function salvarSalario() {
  const mes = document.getElementById("mes").value;
  const ano = document.getElementById("ano").value;
  const salario = Number(document.getElementById("salario").value) || 0;

  salarios[`${mes}-${ano}`] = salario;
  salvar();
  atualizar();
}

function adicionar() {
  const descricao = document.getElementById("descricao").value;
  const valor = document.getElementById("valor").value;

  if (!descricao || !valor) {
    alert("Preencha descrição e valor");
    return;
  }

  dados.push({
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
  const chave = `${mes}-${ano}`;

  // 🔁 Carrega salário salvo do mês
  document.getElementById("salario").value = salarios[chave] || "";

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  dados.forEach((g, i) => {
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

  document.getElementById("totalGastos").innerText = total.toFixed(2);

  const salario = salarios[chave] || 0;
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

// 📊 Excel
function exportarExcel() {
  const mes = document.getElementById("mes").value;
  const ano = document.getElementById("ano").value;
  const chave = `${mes}-${ano}`;
  const salario = salarios[chave] || 0;

  let total = 0;

  const linhas = [
    ["Planejamento Financeiro - Bianca"],
    [`Mês/Ano: ${mes}/${ano}`],
    [],
    ["Descrição", "Valor"]
  ];

  dados.forEach(g => {
    if (g.mes === mes && g.ano == ano) {
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

  XLSX.writeFile(wb, `Financeiro_Bianca_${mes}_${ano}.xlsx`);
}

atualizar();
