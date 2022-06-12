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

const programaCru = params.get("p").replace(/'/g, "")
const programaObjeto = JSON.parse(programaCru);

const qtdLinhas = programaObjeto.lines;
const expressoes = programaObjeto.expressions;

const arrayDeInputsNoHTML = criaEntradasDoUser();

const preEsq = document.getElementById("preEsquerda");
const preDir = document.getElementById("preDireita");


let maxIteracoes = 1000;

// isso é chamado pelo botão
function computaEMostra() {
	preEsq.textContent = "";
	preDir.textContent = "";
	document.getElementById("runtime-container").classList.remove("hidden");
	
	const valoresDeEntrada = pegaEntradaDoHTML();

	simulaComputacao(valoresDeEntrada);
}

/**
 * @param {Map<String, Int>} mapaDeRegistradores 
 */
// TODO: passa linha atual que o bagulho começa
function simulaComputacao(mapaDeRegistradores) {
	let linhaAtual = 2;
	let qtdIteracoes = 0;

	mostraLinhaDeSaidaNoDisplay(
		"instrução inicial e valores de entrada armazenados",
		stringEstadoRegistradores(linhaAtual, mapaDeRegistradores));

	while (linhaAtual != 0) {
		const expressao = expressoes[linhaAtual - 1];
		if (!expressao) continue; // se a linha for um comentário, expressão é null

		if (expressao.type === "if") {
			const ifDeuTrue = checaCondicao(expressao.condition, mapaDeRegistradores);
			if (ifDeuTrue) {
				mostraLinhaDeSaidaNoDisplay(
					`em ${linhaAtual}, como ${formataIgualZero(expressao.condition)}, desviou para ${expressao.onTrue}`,
					stringEstadoRegistradores(expressao.onTrue, mapaDeRegistradores));

				linhaAtual = expressao.onTrue;

			}
			else {
				mostraLinhaDeSaidaNoDisplay(
					`em ${linhaAtual}, como ${formataDiferenteZero(expressao.condition)}, desviou para ${expressao.onFalse}`,
					stringEstadoRegistradores(expressao.onFalse, mapaDeRegistradores));
				
				linhaAtual = expressao.onFalse;
			}
		}

		else if (expressao.type === "call") {
			const logOperacao = executaOperacaoERetornaLog(expressao.what, mapaDeRegistradores);
			mostraLinhaDeSaidaNoDisplay(
				`em ${linhaAtual}, ${logOperacao}, desviou para ${expressao.then}`,
				stringEstadoRegistradores(expressao.then, mapaDeRegistradores));
			
			linhaAtual = expressao.then;
		}

		if (qtdIteracoes >= maxIteracoes) {
			mostraLinhaDeSaidaNoDisplay(
				`ATINGIU ${maxIteracoes} ITERAÇÕES, POSSÍVEL LOOP INFINITO!`,
				stringEstadoRegistradores(0, mapaDeRegistradores));
			return;
		}

		qtdIteracoes++;
	}

	mostraParada();
}

function formataIgualZero(cond) {
	return `${cond.charAt(0)} == 0`;
}

function formataDiferenteZero(cond) {
	return `${cond.charAt(0)} != 0`;
}

/**
 * @param {Map<String, Int>} registradores 
 * @param {String} condicao 
 * @returns {Boolean}
 */
function checaCondicao(condicao, registradores) {
	if (condicao.includes("zero")) {
		const keyRegistrador = condicao.charAt(0);
		return registradores[keyRegistrador] == 0;
	}
	else {
		console.warn("!!!!!!!!!!!!!! CONDICAO NAO INCLUI ZERO !!!!!!!!!!!!!")
		return false;
	}

	// TODO: outras condiçoes, talvez retornar algo daqui (objeto) de log
}

/**
 * @param {String} operacao 
 * @return {String}
 */
function executaOperacaoERetornaLog(operacao, registradores) {
	const keyRegistrador = operacao.charAt(0);

	if (operacao.includes("add")) {
		registradores[keyRegistrador]++;
		return `adicionou no registrador ${keyRegistrador}`;
	}

	else if (operacao.includes("sub")) {
		registradores[keyRegistrador]--;
		return `subtraiu registrador ${keyRegistrador}`;
	}

	else {
		console.warn(" ERRROOOOO OPERAÇAO INVALIDA!! !! !  " + operacao);
		return `DEU ERRO!!! OPERACAO NAO IMPLEMENTADA!!! ${operacao}`;
	}

	// TODO: outras operaçoes
}

// #############################################################################################################################
// ###################################### abaixo somente boilerplate de HTML e javascript ######################################
// #############################################################################################################################

/**
 * @returns {Map<String,Int>}
 */
 function pegaEntradaDoHTML() {
	const map = [];

	let caractere = 'a'
	for(let i = 0; i < templateMaquina.registers; i++) {
		map[caractere] = 0;
		caractere = incrementaCaractere(caractere);
	}

	for (let ch_registrador in arrayDeInputsNoHTML) {
		map[ch_registrador] = parseInt(arrayDeInputsNoHTML[ch_registrador].value);
	}

	return map;
}

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
function stringEstadoRegistradores(numeroDaLinha, mapaDeRegistradores) {
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
 * @param {String} outputDir 
 * @param {String} outputEsq 
 */
function mostraLinhaDeSaidaNoDisplay(outputEsq, outputDir) {
	preEsq.textContent += `${outputEsq} ->\n`;
	preDir.textContent += ` ${outputDir}\n`;
}

function mostraParada() {
	preEsq.textContent += `em 0, programa parou! ->\n`;
	preDir.textContent += ` ✓`;
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
		inputEl.value = Math.floor(Math.random() * (7 + 1));
		
		entradas[caractereDoRegistrador] = inputEl;
		
		inputersDiv.appendChild(previewEl);
		inputersDiv.appendChild(inputEl);
	})

	return entradas;
}