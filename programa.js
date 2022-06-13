console.log("opa vc ta na pagina do programa meu cupinscher")

const newLineRegex = /\r?\n|\r/g;

// deixa passar só ~4000 caracteres por causa do tamanho do http header, mas acho que limita pro usuário msm e foda-se
function mandaProgramaPraComputacao() {

	/** @type {String} */
	const text = editor.getValue()
	// const textWithEncodedLBs = text.replace(newLineRegex, "<EOL>") // troca \n por <EOL> caso precise

  const lines = text.split(newLineRegex);
  const programJson = createJsonObjectFromLines(lines);
  
  const programJsonString = JSON.stringify(programJson);

	// const lineCount = (textWithLBs.match() || []).length + 1
	// alert(`text has ${lineCount} lines of code`)
	// const mockProgram = {"lines": 16,"expressions": [	null,	{ "type": "if","condition": "a_zero","onTrue": 0,"onFalse": 5},null, null,{ "type": "if","condition": "b_zero","onTrue": 11,"onFalse": 6},{ "type": "call","what": "c_add","then": 7},{ "type": "call","what": "d_add","then": 8},{ "type": "call","what": "b_sub","then": 5},null, null,{ "type": "if","condition": "c_zero","onTrue": 16,"onFalse": 12},{"type": "call","what": "b_add","then": 13},{"type": "call","what": "c_sub","then": 11},null, null,{"type": "call","what": "a_sub","then": 2},]}
	// const mockProgramJson = JSON.stringify(mockProgram);

	const uri = encodeURI(`computacao?p='${programJsonString}'`);
	window.location.href = uri;
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