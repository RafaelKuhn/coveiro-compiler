console.log("opa vc ta na pagina do programa meu cupinscher")

const newLineRegex = /\r?\n|\r/g;

// deixa passar só ~4000 caracteres por causa do tamanho do http header, mas acho que limita pro usuário msm e foda-se
function mandaProgramaPraComputacao() {

	/** @type {String} */
	const text = editor.getValue()
	const textWithEncodedLBs = text.replace(newLineRegex, "<EOL>")

	// const lineCount = (textWithLBs.match() || []).length + 1
	// alert(`text has ${lineCount} lines of code`)

	const uri = encodeURI(`computacao?p='${textWithEncodedLBs}'`)

	window.location.href = uri
}