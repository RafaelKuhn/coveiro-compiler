let checkBoxes = [];
let qtdRegistradores;

const properties = [
	'stores',
	'returns',
	'ifZero',
	'greater',
	'lesser',
	'adds',
	'subs',
	'mults',
	'divis'
];

function criaTabela() {
	qtdRegistradores = parseInt(document.getElementById('qtdRegistradores').value);
	if (qtdRegistradores < 1 || qtdRegistradores > 16 || !qtdRegistradores) {
		alert("Número incorreto de registradores!");
		return;
	}

	let table = document.getElementById('idTabela');
	let botaoValidar = document.getElementById('idBotaoValidar');

	if (table != null && botaoValidar != null) {
		table.remove();
		botaoValidar.remove();
	}

	let tblDiv = document.getElementById('tabela');
	table = document.createElement('table');
	table.id = 'idTabela';
	table.border = '1px';
	table.style.width = '100%'

	let tableHead = document.createElement('thead');
	table.appendChild(tableHead);
	let tableIndex = ['Registrador', 'Armazena', 'Retorna', 'If Zero', 'Maior que', 'Menor que', 'Soma', 'Subtração', 'Multiplicação', 'Divisão'];
	let linhaHead = document.createElement('tr');
	
	// cabeçalho
	for (let col = 0; col < tableIndex.length; col++) {
		let th = document.createElement('th');
		th.textContent = tableIndex[col];
		linhaHead.appendChild(th);
	}
	tableHead.appendChild(linhaHead);

	// corpo
	let tableBody = document.createElement('tbody');
	table.appendChild(tableBody);
	for (let linha = 0; linha < qtdRegistradores; linha++) {

		let linhaBody = document.createElement('tr');
		td = document.createElement('td');
		td.textContent = String.fromCharCode(97 + linha);
		linhaBody.appendChild(td);
		checkBoxes[linha] = [];

		for (let coluna = 1; coluna < tableIndex.length; coluna++) {
			td = document.createElement('td');
			let checkBox = document.createElement('input');
			checkBox.type = 'checkbox';
			checkBox.style.width = '100%';
			checkBox.style.height = '20px';

			td.appendChild(checkBox);
			linhaBody.appendChild(td);

			checkBoxes[linha].push(checkBox);
		}
		tableBody.appendChild(linhaBody);
	}

	tblDiv.appendChild(table);

	// botão
	botaoValidar = document.createElement('button');
	botaoValidar.id = 'idBotaoValidar'
	botaoValidar.type = 'button';
	botaoValidar.textContent = 'Gerar Máquina';
	botaoValidar.onclick = validarMaquina;
	
	document.getElementById('botaoValidar').appendChild(botaoValidar);
}

function validarMaquina() {
	const machine = {};
	machine.registers = qtdRegistradores;

	for (let i = 0; i < properties.length; i++) {
		machine[properties[i]] = [];
	}

	for (let y = 0; y < checkBoxes.length; y++) {
		const checkBoxesY = checkBoxes[y]
		for (let x = 0; x < checkBoxesY.length; x++) {
			const current = checkBoxesY[x];
			if (current.checked) {
				machine[properties[x]].push(registerIndexToLetter(y));
			}
		}
	}

	const machineJson = JSON.stringify(machine);
	const uri = encodeURI(`programa?m='${machineJson}'`);
	
	criaBotaoEnviar(uri);
	criaOuAtualizaNotacaoFormal(machine);
}

function criaOuAtualizaNotacaoFormal(machineObj) {
	const preGerada = document.getElementById("notacaoFormal");
	if (preGerada) {
		preGerada.textContent = geraNotacaoFormal(machineObj);
		return;
	}

	const pre = document.createElement("pre");
	pre.id = "notacaoFormal";
	pre.style.borderStyle = "groove";
	pre.textContent = geraNotacaoFormal(machineObj);

	document.getElementById("maquinaGerada").appendChild(pre);
}

function geraNotacaoFormal(machine) {
	let notacao = "";
	
	const nomeMaquina = document.getElementById("nomeMaquina").value;
	
	const qtdReg = machine.registers;
	const qtdRegEntrada = machine.stores.length;
	const qtdRegSaida = machine.returns.length;
	const inversos = geraRegistradoresInversos(qtdReg);

	// primeira linha
	notacao += `${nomeMaquina} = N^${qtdReg}, N^${qtdRegEntrada}, N^${qtdRegSaida}\n\n\n`;

	// linhas de entrada:
	notacao += machine.stores.reduce((acc, current) => { // TODO: ∀neN ??  ∈ ? ????
		acc += `armazena_${current}: N^${qtdReg} tal que, ∀neN, armazena_${current}(n) = ${padZeros(current, qtdReg)};\n`
		return acc;
	}, "");
	notacao += "\n";

	// linhas de saída:
	notacao += machine.returns.reduce((acc, current) => {
		acc += `retorna_${current}: N^${qtdReg} -> N tal que, ∀${inversos}∈N^${qtdReg}, retorna_${current}${inversos} = ${inverseReg(current)};\n`
		return acc;
	}, "");
	notacao += "\n";

	// linhas de add:
	notacao += machine.adds.reduce((acc, current) => {
		acc += `adiciona_${current}: N^${qtdReg} -> N tal que, ∀${inversos}∈N^${qtdReg}, adiciona_${current}${inversos} = ${inverseRegsOperation(current, inversos, "+1")};\n`
		return acc;
	}, "");
	notacao += "\n";

	// linhas de sub:
	notacao += machine.subs.reduce((acc, current) => {
		acc += `subtrai_${current}: N^${qtdReg} -> N tal que, ∀${inversos}∈N^${qtdReg}, subtrai_${current}${inversos} = ${inverseRegsOperation(current, inversos, "-1")};\n`
		return acc;
	}, "");
	notacao += "\n";

	// TODO: MULT, DIV, VARRER ATE qtdReg, CRIANDO UM += PARA CADA ELEMENTO
	notacao += "TODO: MULTS\n\n";
	notacao += "TODO: DIVIS\n\n";

	// linhas de ifZero:
	notacao += machine.ifZero.reduce((acc, current) => {
		const lbl = `${current}_zero`;
		const inv = inverseReg(current);
		acc += `${lbl} -> {verdadeiro, falso} tal que, ∀${inversos}, ∈N^7, ${lbl}${inversos} = verdadeiro, se ${inv}=0; ${lbl}${inversos} = falso, se ${inv}≠0 (${current}=${inv})\n`
		return acc;
	}, "");
	notacao += "\n";

	// TODO: GREATER, LESSER
	notacao += "TODO: GREATER\n\n";
	notacao += "TODO: LESSER\n\n";

	// TODO: CHECAR SE machine.ifZero tem length != 0 antes de dar quebra de linha nessa property

	// properties = [
	// 	'stores',
	// 	'returns',
	// 	'ifZero',
	// 	'greater',
	// 	'lesser',
	// 	'adds',
	// 	'subs',
	// 	'mults',
	// 	'divis'
	// ];

	return notacao;
}

// com reg = c; length = 4;
// gera output "(0, 0, c, 0)"
function padZeros(reg, length) {
	let template = '0';
	for (let i = 1; i < length; i++) {
		template += ',0';
	}
	const asciiDistanceToA = reg.charCodeAt(0) - 97;
	const output = template.substring(0, asciiDistanceToA * 2) + reg + template.substring(asciiDistanceToA * 2 + 1);
	return `(${output})`;
}

// com qtd 4, gera output "(z, y, x, w)"
function geraRegistradoresInversos(qtd) {
	let output = "("
	for (let i = 0; i < qtd; i++) {
		output += `${String.fromCharCode(122 - i)},`;
	}
	output = output.slice(0, -1) + ')';
	return output;
}

// a, b, c -> z, y, x
function inverseReg(register) {
	return String.fromCharCode(122 - (register.charCodeAt(0) - 97));
}

// com inverseRegs = "(z, y, x, w)"; current = "a"; append = "+1";
// gera output "(a+1, y, x, w)"
function inverseRegsOperation(current, inverseRegs, append) {
	const regToReplace = inverseReg(current);
	return inverseRegs.replace(regToReplace, `${current}${append}`);
}

// 0, 1, 2 -> a, b, c
function registerIndexToLetter(index) {
	return String.fromCharCode(97 + index);
}

function criaBotaoEnviar(uri) {
	let botaoEnviar = document.getElementById('idBotaoEnviar')

	if (botaoEnviar != null) {
		botaoEnviar.remove();
	}
	
	botaoEnviar = document.createElement('button');
	botaoEnviar.id = 'idBotaoEnviar'
	botaoEnviar.type = 'button';
	botaoEnviar.textContent = 'Ir Para o Programa Com A Máquina Gerada';
	botaoEnviar.onclick = () => window.location.href = uri;

	document.getElementById('botaoEnviar').appendChild(botaoEnviar);	
}

function criaTabelaDefault() {
	
	document.getElementById('qtdRegistradores').value = 4;
	criaTabela();

	const aRow = checkBoxes[0];
	const bRow = checkBoxes[1];
	const cRow = checkBoxes[2];
	const dRow = checkBoxes[3];

	// stores: a, b
	aRow[0].checked = true;
	bRow[0].checked = true;
	// returns: d
	dRow[1].checked = true;
	// ifZero: a, b, c
	aRow[2].checked = true;
	bRow[2].checked = true;
	cRow[2].checked = true;
	// sums: b, c, d
	bRow[5].checked = true;
	cRow[5].checked = true;
	dRow[5].checked = true;
	// subs: a, b, c
	aRow[6].checked = true;
	bRow[6].checked = true;
	cRow[6].checked = true;
}


criaTabelaDefault();