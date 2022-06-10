console.log("temo na pagina do compiuter")

const params = new URLSearchParams(decodeURI(window.location.search))

// const rawMachine = params.get("m").replace(/'/g, "")
const templateMaquina = {
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
}

const rawProgram = params.get("p").replace(/'/g, "")
const programObj = JSON.parse(rawProgram);

// document.getElementById("codezao").textContent = `código:\n\n${dataWithLiteralLBs}`

const lineAmount = programObj.lines;
const expressions = programObj.expressions;
console.log(programObj.expressions);

const entradasNoHTML = criaEntradasDoUser();


// isso é chamado pelo botão
function computaEMostra() {
	const pre = criaOuAchaOPre();
	
	const valoresDeEntrada = inicializaRegistradores();

	simulaComputacao(valoresDeEntrada, pre);
}

/**
 * @returns {Map<String,Int>}
 */
function inicializaRegistradores() {
	const map = [];

	let caractere = 'a'
	for(let i = 0; i < templateMaquina.registers; i++) {
		// console.log("criando valor para o registrador " + caractere);
		map[caractere] = 0;
		caractere = incrementaCaractere(caractere);
	}

	for (let ch_registrador in entradasNoHTML) {
		map[ch_registrador] = parseInt(entradasNoHTML[ch_registrador].value);
	}

	return map;
}

/**
 * @param {Map<String, Int>} mapaDeRegistradoresQueArmazenam 
 * @param {HTMLPreElement} elementoParaDisplay 
 */
function simulaComputacao(mapaDeRegistradoresQueArmazenam, elementoParaDisplay) {
	let linhaAtual = 2; // TODO: acha a linha que o algoritmo começa de fato, não é sempre 2
	let stringEstadoDosRegistradores = converteIteracaoParaString(linhaAtual, mapaDeRegistradoresQueArmazenam);
	let stringOutputDaOperacao       = "instrução inicial e valores de entrada armazenados"

	let itCount = 0;

	mostraLinhaDeSaidaNoDisplay(stringOutputDaOperacao, stringEstadoDosRegistradores, elementoParaDisplay);

	while (linhaAtual != 0) {
		const lineExpression = expressions[linhaAtual - 1];
		if (!lineExpression) continue; // se for null, a linha é um comentário

		if (lineExpression.type === "if") {
			console.log(`fazendo um if: ${lineExpression.condition} ? va_para ${lineExpression.onTrue} : va_para ${lineExpression.onFalse}`);
			
			if (checaCondicao(lineExpression.condition, mapaDeRegistradoresQueArmazenam)) {
				linhaAtual = lineExpression.onTrue;
			} else {
				console.log("deu false");
				linhaAtual = lineExpression.onFalse;
			}

		}

		else if (lineExpression.type === "call") {
			console.log(`fazendo um call: ${lineExpression.what} -> va_para ${lineExpression.then} `);
			executaOperacao(lineExpression.what, mapaDeRegistradoresQueArmazenam);
			linhaAtual = lineExpression.then;
		}
	}

	console.log("redirecionado para a linha zero, acabou!");
}

/**
 * 
 * @param {Map<String, Int>} registradores 
 * @param {String} condicao 
 * @returns {Boolean}
 * 
 */
function checaCondicao(condicao, registradores) {
	if (condicao.includes("zero")) {
		const keyRegistrador = condicao.charAt(0);
		console.log(`registrador ${keyRegistrador} !! valor ${registradores[keyRegistrador]} `);
		return registradores[keyRegistrador] == 0;
	}	
	else {
		console.warn("!!!!!!!!!!!!!! CONDICAO NAO INCLUI ZERO !!!!!!!!!!!!!")
		return false;
	}
}

/**
 * @param {String} operacao 
 */
function executaOperacao(operacao, registradores) {
	const keyRegistrador = operacao.charAt(0);
	if (operacao.includes("add")) {
		registradores[keyRegistrador]++;
	}
	else if (operacao.includes("sub")) {
		registradores[keyRegistrador]--;
	}
	else {
		console.warn(" ERRROOOOO OPERAÇAO INVALIDA!! !! !  " + operacao);
	}

	console.log("valores ate entao: "+converteIteracaoParaString(-1, registradores));
}

// #############################################################################################################################
// ###################################### abaixo somente boilerplate de HTML e javascript ######################################
// #############################################################################################################################
/**
 * 
 * @param {String} caractere 
 * @returns {String}
 */
function incrementaCaractere(caractere) {
	return String.fromCharCode(caractere.charCodeAt(0) + 1);
}

/**
 * @param {Int} numeroDaLinha 
 * @param {Map<String, Int>} mapaDeRegistradores 
 * @returns {String}
 */
function converteIteracaoParaString(numeroDaLinha, mapaDeRegistradores) {
	let output = `(${numeroDaLinha}, (`;
	
	for (let ch_registrador in mapaDeRegistradores) {
		// console.log(`reg ${ch_registrador}: ${mapaDeRegistradores[ch_registrador]} `);
		output += `${ch_registrador}: ${mapaDeRegistradores[ch_registrador]}, `;
	}
	output = output.slice(0, -2); // remove os dois últimos caracteres -> ", "
	output += "))";

	return output;
}

/**
 * @param {String} estadoRegistradores 
 * @param {String} resultadoOperacao 
 * @param {HTMLPreElement} elementoParaDisplay 
 */
function mostraLinhaDeSaidaNoDisplay(resultadoOperacao, estadoRegistradores, elementoParaDisplay) {
	elementoParaDisplay.textContent += `${resultadoOperacao} -> ${estadoRegistradores}\n`
}


/** @returns {Array<inputEl>} */
function criaEntradasDoUser() {
	const entradas = []
	const inputersDiv = document.getElementById("inputers");
	const registradoreDeEntrada = templateMaquina.stores;
	
	registradoreDeEntrada.forEach(caractereDoRegistrador => {
		const previewEl = document.createElement("span");
		previewEl.textContent = ` ${caractereDoRegistrador.toUpperCase()}: `;
		
		const inputEl = document.createElement("input");
		inputEl.max = 255;
		inputEl.min = 0;
		inputEl.value = 0;
		inputEl.value = 3; // TODO: remove
		
		entradas[caractereDoRegistrador] = inputEl;
		
		inputersDiv.appendChild(previewEl);
		inputersDiv.appendChild(inputEl);
	})

	return entradas;
}

/** @returns {HTMLPreElement} */
function criaOuAchaOPre() {
	const preCriado = document.getElementById("runtime");
	if (preCriado) {
		preCriado.textContent = "";
		return preCriado;
	}

	const runtimeContainer = document.getElementById("runtime-container");
	
	const newTitleEl = document.createElement("h2");
	newTitleEl.textContent = "Execução:"
	
	const newPreEl = document.createElement("pre");
	newPreEl.id = "runtime";
	// newPreEl.textContent = "<>"
	
	runtimeContainer.appendChild(newTitleEl);
	runtimeContainer.appendChild(newPreEl);
	
	return newPreEl;
}
