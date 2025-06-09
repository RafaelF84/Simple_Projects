let expressao = "";

function adicionar(valor) {
  if (expressao === "0" && valor !== ".") {
    expressao = valor;
  } else {
    expressao += valor;
  }
  atualizarDisplay();
}

function limpar() {
  expressao = "";
  atualizarDisplay("0");
}

function calcular() {
  try {
    const resultado = eval(expressao);
    expressao = resultado.toString();
    atualizarDisplay();
  } catch (e) {
    atualizarDisplay("Erro");
    expressao = "";
  }
}

function atualizarDisplay(valor) {
  document.getElementById("display").textContent = valor || expressao || "0";
}
