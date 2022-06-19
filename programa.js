const newLineRegex = /\r?\n|\r/g;
const params = new URLSearchParams(decodeURI(window.location.search))

// deixa passar só ~4000 caracteres por causa do tamanho do http header, mas acho que limita pro usuário msm e foda-se
function mandaProgramaPraComputacao() {
  
  const rawMachine = params.get("m").replace(/'/g, "");
  const machineObject = JSON.parse(rawMachine);

  /** @type {String} */
	const text = editor.getValue()
  
  const lines = text.split(newLineRegex);
  
  const erros = validaCodigo(lines, machineObject);
  editor.getSession().setAnnotations(erros);
  
  if(erros.length > 0) {
    alert("Erros encontrados, verifique seu programa.");
    return;
  }

  const programJson = createJsonObjectFromLines(lines);
  const programJsonString = JSON.stringify(programJson);
  
	const uri = encodeURI(`computacao?p='${programJsonString}'&m='${rawMachine}'`);
	window.location.href = uri;
}

/** @param {String[]} linhas */
function validaCodigo(linhas, maquina) {
  let erros = []

  const ifNaoFechadoRegex = "^se [a-zA-Z]_[a-zA-Z-_]+ va_para [0-9]+ senao va_para [0-9]+$"
  const facaNaoFechadoRegex = "^faca [a-zA-Z]_[a-zA-Z-_]+ va_para [0-9]+$"

  linhas.map((linha, index) => {
    
    linha = linha.trim().replace("  "," ");
    const termosDaLinha = linha.split(" ")
    const linhaVaPara = Number(termosDaLinha[3]) ?? -1;
    const operacao = termosDaLinha[1] ?? "";
  
    if(linha.startsWith("se")) {
      
      if(linha.match(ifNaoFechadoRegex) == null){
        const error = {
          row: index,
          column: 0,
          text: "Sintaxe ínvalida: 'se' precisa de uma condição, um 'va_para' e um 'senao va_para'",
          type: "error"
        }
        erros.push(error);
      }

      const linhaSenao = Number(termosDaLinha[6]) ?? -1;

      if (linhaVaPara != 0) {
        const erro = checaSeLinhaEValida(linhaVaPara, linhas) 

        if(erro != null) { erros.push(erro); }
      }

      if (linhaSenao != 0) {
        const erro = checaSeLinhaEValida(linhaSenao, linhas) 

        if(erro != null) { erros.push(erro); }
      }
    }
    else if (linha.startsWith("faca")){
      if(linha.match(facaNaoFechadoRegex) == null){
        const error = {
          row: index,
          column: 0,
          text: "Sintaxe ínvalida: 'faca' precisa de uma operação e um 'va_para' que aponta para outra linha",
          type: "error"
        }
        erros.push(error);
      }

      const erro = checaSeLinhaEValida(linhaVaPara, linhas) 

      if(erro != null) { erros.push(erro) }
    }

    if(linha.startsWith("#") == false && linha != "" && operacao != ""){
      const operacaoExiste = checaSeOperacaoExiste(operacao, maquina);
      if(operacaoExiste == false) {
        const error = {
          row: index,
          column: 0,
          text: "Operação '" + operacao + "'" +" inválida para esse registrador ou registrador inexistente",
          type: "error"
        }
        erros.push(error);
      }
    }
  })

  return erros;
}

// Cria json do programa a partir dos objetos das linhas
function createJsonObjectFromLines(lines) {
  var programJson = {
    lines: lines.length,
    expressions: []
  };

  lines.map(line => {
    const expressionJson = separateLineElements(line);
    programJson.expressions.push(expressionJson);
  })

  return programJson;
}

// Separa as "palavras" da linha em um objeto
function separateLineElements(line) {
  const lineElements = line.split(" ");

  if(lineElements[0] === "" || lineElements[0].charAt(0) === "#") { return null; }

  const expressionJson = {}

  if(lineElements[0] === "se"){
    expressionJson.type = "if";
    expressionJson.condition = lineElements[1];
    expressionJson.onTrue = Number(lineElements[3]);
    expressionJson.onFalse = Number(lineElements[6]);

    return expressionJson;
  }

  expressionJson.type = "call";
  expressionJson.what = lineElements[1];
  expressionJson.then = Number(lineElements[3]);

  return expressionJson;
}

// Checa se o registrador existe e se tem essa função
/** @param {String} operacao */
function checaSeOperacaoExiste(operacao, maquina) {

  const termosDaOperacao = operacao.split("_");
  const registrador = termosDaOperacao[0]
  const funcao = traduzOperacaoPraIndexDaMaquina(termosDaOperacao[1])
  const segundoRegistrador = termosDaOperacao[2];

  let registradorTemOperacao = false;

  for (const machineOp in maquina) {
    if(funcao === machineOp) {
      for (const machineRegist of maquina[funcao]) {
        if (registrador == machineRegist) {
          registradorTemOperacao = true;
          break;
        }
      }
      break;
    }
  }

  if(!segundoRegistrador) { return registradorTemOperacao; }
  const segundoRegistradorExiste = checaSeSegundoRegistradorExiste(segundoRegistrador, maquina)
  console.log("sgundo registrador de " + operacao + " é " + segundoRegistrador + " e ele " + (segundoRegistradorExiste? "existe" : "não existe"))
  return segundoRegistradorExiste && registradorTemOperacao;
}

// Chega se o segundo registrador, no caso de operações de mult, div, maior e menor, existe
function checaSeSegundoRegistradorExiste(registrador, maquina){
  for (const machineOp in maquina) {
    if( machineOp == "registers") { continue; }
    for (const regist of maquina[machineOp]) {
      if (registrador == regist) {
        return true;
      }
    }
  }

  return false;
}

// "Traduz" as funções para os index usados pela máquina
function traduzOperacaoPraIndexDaMaquina(operacao) {
  switch (operacao) {
    case "add":
      return "adds";
  
    case "sub":
      return "subs";
    
    case "zero":
      return "ifZero";
    
    case "maior":
      return "greater";
    
    case "menor":
      return "lesser";
    
    case "mult":
      return "mults";

    case "div":
      return "divis"
    
    case "retorna":
      return "returns"
      
    default:
      break;
  }
}


// Método que checa se a linha indicada no 'va_para' é vazia/comentada ou maior/menor que a quantidade de linhas
/**
 * @param {Number} index 
 * @param {String[]} linhas 
 */
function checaSeLinhaEValida(index, linhas){
  if(isNaN(index) || index >= linhas.length+1 || index < 0 ||
    linhas[index-1] == "" || linhas[index-1].startsWith("#")) {        
      const error = {
        row: index,
        column: 0,
        text: "Linha inidicada à operação 'va_para' é vazia ou inexistente",
        type: "error"
      }
      return (error);
  }
}