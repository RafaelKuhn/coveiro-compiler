
const newLineRegex = /\r?\n|\r/g;

// deixa passar só ~4000 caracteres por causa do tamanho do http header, mas acho que limita pro usuário msm e foda-se
function mandaProgramaPraComputacao() {

	/** @type {String} */
	const text = editor.getValue()

  const lines = text.split(newLineRegex);
  
  const erros = validaCodigo(lines);
  editor.getSession().setAnnotations(erros);

  if(erros.length > 0) {
    alert("Erros encontrados, verifique seu programa.");
    return;
  }

  const programJson = createJsonObjectFromLines(lines);
  const programJsonString = JSON.stringify(programJson);

	const uri = encodeURI(`computacao?p='${programJsonString}'`);
	window.location.href = uri;
}

/** @param {String[]} linhas */
function validaCodigo(linhas) {
  let erros = []

  const ifNaoFechadoRegex = "^se [a-zA-Z]_[a-zA-Z]+ va_para [0-9]+ senao va_para [0-9]+$"
  const facaNaoFechadoRegex = "^faca [a-zA-Z]_[a-zA-Z]+ va_para [0-9]+$"

  linhas.map((linha, index) => {

    if(linha.startsWith("se")) {
      // console.log("linha " + index + " tem um se")
      if(linha.match(ifNaoFechadoRegex) == null){
        const error = {
          row: index,
          column: 0,
          text: "Sintaxe ínvalida: 'se' precisa de uma condição, um 'va_para' e um 'senao va_para'",
          type: "error"
        }
        erros.push(error);
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
    }
  })

  return erros;
}

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

function checaSeOperacaoExiste(operacao) {

}

const mockMachine = {
  "registers": 4,
  "stores": [
    "a", "b"
  ],
  "returns": [
    "d"
  ],
  "ifZero": [
    "a", "b", "c"
  ],
  "sums": [
    "b", "c", "d"
  ],
  "subs": [
    "a", "b", "c"
  ],
  "mults": [],
  "divis": [],
  "greater": [],
  "lesser": [],
  "returns": [],
};