console.log("opa vc ta na pagina do programa meu cupinscher")

const newLineRegex = /\r?\n|\r/g;

// deixa passar só ~4000 caracteres por causa do tamanho do http header, mas acho que limita pro usuário msm e foda-se
function mandaProgramaPraComputacao() {

	/** @type {String} */
	const text = editor.getValue()
	// const textWithEncodedLBs = text.replace(newLineRegex, "<EOL>") // troca \n por <EOL> caso precise

	// const lineCount = (textWithLBs.match() || []).length + 1
	// alert(`text has ${lineCount} lines of code`)

	const mockProgram = {"lines": 16,"expressions": [	null,	{ "type": "if","condition": "a_zero","onTrue": 5,"onFalse": 0},null, null,{ "type": "if","condition": "b_zero","onTrue": 11,"onFalse": 6},{ "type": "call","what": "c_add","then": 7},{ "type": "call","what": "d_add","then": 8},{ "type": "call","what": "b_sub","then": 5},null, null,{ "type": "if","condition": "c_zero","onTrue": 16,"onFalse": 12},{"type": "call","what": "b_add","then": 13},{"type": "call","what": "c_sub","then": 11},null, null,{"type": "call","what": "a_sub","then": 2},]}
	const mockProgramJson = JSON.stringify(mockProgram);

	const uri = encodeURI(`computacao?p='${mockProgramJson}'`)
	window.location.href = uri
}