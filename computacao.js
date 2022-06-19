const params = new URLSearchParams(decodeURI(window.location.search))

const rawMachine = params.get("m").replace(/'/g, "")
const maquinaObjeto = JSON.parse(rawMachine);

const programaCru = params.get("p").replace(/'/g, "");
const programaObjeto = JSON.parse(programaCru); console.log(programaObjeto);

// const qtdLinhas = programaObjeto.lines; // NAO USADO
const expressions = programaObjeto.expressions;

const arrayDeInputsNoHTML = criaEntradasDoUser();

const preEsq = document.getElementById("preEsquerda");
const preDir = document.getElementById("preDireita");


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
function simulaComputacao(mapaDeRegistradores) {
	let linhaAtual = achaLinhaQueOAlgoritmoComeca();

	let maxIteracoes = 1000;
	let qtdIteracoes = 0;

	mostraLinhaDeSaidaNoDisplay(
		"instrução inicial e valores de entrada armazenados",
		stringEstadoRegistradores(linhaAtual, mapaDeRegistradores));

	while (linhaAtual !== 0) {
		const expressao = expressions[linhaAtual - 1]; // linhas começam em 1, array começa em 0
		if (!expressao) {
			mostraLinhaDeSaidaNoDisplay(
				`EM ${linhaAtual}, ENCONTROU ERRO!`,
				"MANDOU PARA LINHA QUE NAO EXISTE");
			return;
		}

		// resolve linhas com IF
		if (expressao.type === "if") {
			const condicaoRetornouTrue = checaCondicao(expressao.condition, mapaDeRegistradores);
			if (condicaoRetornouTrue) {
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

		// resolve linhas com FACA
		else if (expressao.type === "call") {
			const logOperacao = executaOperacaoERetornaLog(expressao.what, mapaDeRegistradores);
			mostraLinhaDeSaidaNoDisplay(
				`em ${linhaAtual}, ${logOperacao}, desviou para ${expressao.then}`,
				stringEstadoRegistradores(expressao.then, mapaDeRegistradores));
			
			linhaAtual = expressao.then;
		}

		if (qtdIteracoes >= maxIteracoes) {
			const userWishesToContinue = confirm(`O programa atingiu ${maxIteracoes} iterações, possível loop infinito, deseja continuar?\n(se continuar, o máximo de iterações será dobrado)`)
			if (!userWishesToContinue) {
				mostraQualquerCoisa(`\nITERAÇÕES ATÉ ENTÃO: ${maxIteracoes} POSSÍVEL LOOP`, "\n INFINITO, DEPURE SEU CÓDIGO!");
				return;
			}

			maxIteracoes *= 2;
		}

		qtdIteracoes++;
	}

	mostraQualquerCoisa("em 0, programa parou! ->\n", " ✓");
}

/**
 * @returns {Number}
 */
function achaLinhaQueOAlgoritmoComeca() {
	for (let i = 0; i < expressions.length; i++) {
		if (expressions[i]) {
			return i+1;
		}
	}

	console.error("ERRO! ALGORITMO VAZIO!");
	return 0;
}

function formataIgualZero(cond) {
	return `${cond.charAt(0)}=0`;
}

function formataDiferenteZero(cond) {
	return `${cond.charAt(0)}≠0`;
}

/**
 * @param {Map<String, Int>} registradores 
 * @param {String} condicao 
 * @returns {Boolean}
 */
function checaCondicao(condicao, registradores) {
	const keyRegistrador = condicao.charAt(0);
	
	if (condicao.includes("zero")) {
		return registradores[keyRegistrador] === 0;
	}
	
	if (condicao.includes("maior")) {
		const keyRegistradorK = condicao.charAt(condicao.length - 1);
		return registradores[keyRegistrador] > registradores[keyRegistradorK];
	}

	if (condicao.includes("menor")) {
		const keyRegistradorK = condicao.charAt(condicao.length - 1);
		return registradores[keyRegistrador] < registradores[keyRegistradorK];
	}
	
	console.warn(`!!! CONDICAO ${condicao} NAO IMPLEMENTADA !!!`)
	return false;
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
		return `subtraiu do registrador ${keyRegistrador}`;
	}

	else if (operacao.includes("mult")) {
		const keyRegistradorK = operacao.charAt(operacao.length-1);
		registradores[keyRegistrador] *= registradores[keyRegistradorK];
		return `multiplicou o valor registrador ${keyRegistrador} por ${keyRegistradorK}`;
	}

	else if (operacao.includes("div")) {
		const keyRegistradorK = operacao.charAt(operacao.length-1);
		const valorRegK = registradores[keyRegistradorK];
		if (valorRegK === 0) {
			registradores[keyRegistrador] = 0;
			return `DIVISÃO POR ZERO! RETORNANDO ZERO! ${keyRegistrador} por ${keyRegistradorK}`;
		}
		else {
			const result = parseInt(registradores[keyRegistrador] / valorRegK); // descarta a parte decimal
			registradores[keyRegistrador] = result;
			return `dividiu o valor do registrador ${keyRegistrador} por ${keyRegistradorK}`;
		}
	}

	else {
		return `ERRO!!! "${operacao}" NAO IMPLEMENTADO!!!`;
	}
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
	for(let i = 0; i < maquinaObjeto.registers; i++) {
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
	output = output.slice(0, -2); // remove os dois últimos caracteres: ", "
	output += "))";

	return output;
}

function mostraLinhaDeSaidaNoDisplay(outputEsq, outputDir) {
	mostraQualquerCoisa(`${outputEsq} ->\n`, ` ${outputDir}\n`);
}

function mostraQualquerCoisa(textoEsquerda, textoDireita) {
	preEsq.textContent += textoEsquerda;
	preDir.textContent += textoDireita;
}


/** @returns {Array<inputEl>} */
function criaEntradasDoUser() {
	const entradas = []
	const inputersDiv = document.getElementById("inputers");
	const registradoreDeEntrada = maquinaObjeto.stores;
	
	registradoreDeEntrada.forEach(caractereDoRegistrador => {
		const previewEl = document.createElement("span");
		previewEl.textContent = ` ${caractereDoRegistrador.toUpperCase()}: `;
		
		const inputEl = document.createElement("input");
		inputEl.max = 255;
		inputEl.min = 0;
		inputEl.value = Math.floor(Math.random() * (7)) + 1; // número aleatório de 1 a 7
		
		entradas[caractereDoRegistrador] = inputEl;
		
		inputersDiv.appendChild(previewEl);
		inputersDiv.appendChild(inputEl);
	})

	return entradas;
}