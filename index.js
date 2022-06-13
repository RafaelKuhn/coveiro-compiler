console.log("temo na página do maquinario");

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
	let table = document.getElementById('idTabela');
	let botaoValidar = document.getElementById('idBotaoValidar');

	if (table != null & botaoValidar != null) {
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
	for (let col = 0; col < tableIndex.length; col++) {
		let th = document.createElement('th');
		th.textContent = tableIndex[col];
		linhaHead.appendChild(th);
	}
	tableHead.appendChild(linhaHead);

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
	botaoValidar = document.createElement('button');
	botaoValidar.id = 'idBotaoValidar'
	botaoValidar.type = 'button';
	botaoValidar.textContent = 'Validar';
	botaoValidar.onclick = validarMaquina;
	document.getElementById('botaoValidar').appendChild(botaoValidar);
}


function validarMaquina() {
	const machine = {};
	machine.registers = qtdRegistradores;

	for (let i = 0	; i < properties.length; i++) {
		machine[properties[i]] = [];
		console.log(properties[i]);
	}

	for (let y = 0; y < checkBoxes.length; y++) {
		const checkBoxesY = checkBoxes[y]
		for (let x = 0; x < checkBoxesY.length; x++) {
			const current = checkBoxesY[x];
			if (current.checked) {
				machine[properties[x]].push(String.fromCharCode(97 + y));
			}
		}
	}

	let machineJson = JSON.stringify(machine);
	let uri = encodeURI(`programa?m='${machineJson}'`);
	criaBotaoEnviar(uri);
}

function criaBotaoEnviar(uri) {
	let botaoEnviar = document.getElementById('idBotaoEnviar')

	if (botaoEnviar != null) {
		botaoEnviar.remove();
	}
	
	botaoEnviar = document.createElement('button');
	botaoEnviar.id = 'idBotaoEnviar'
	botaoEnviar.type = 'button';
	botaoEnviar.textContent = 'Enviar';
	botaoEnviar.onclick = 	() => {window.location.href = uri;};
	document.getElementById('botaoEnviar').appendChild(botaoEnviar);	
}