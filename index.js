console.log("temo na página do maquinario");

let checkBoxes = [];
let qtdRegistradores;
function criaTabela() {
	qtdRegistradores = parseInt(document.getElementById('qtdRegistradores').value);
	let tblDiv = document.getElementById('tabela');
	let table = document.createElement('table');
	table.border = '1px';
	table.style.width = '50%'

	let tableHead = document.createElement('thead');
	table.appendChild(tableHead);
	let tableIndex = ['Registrador', 'Armazena', 'Retorna', 'Checa Zero', 'Soma', 'Subtração', 'Multiplica', 'Divide'];
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

		for (let coluna = 1; coluna < tableIndex.length; coluna++) {
		
			td = document.createElement('td');
			let checkBox = document.createElement('input');
			checkBox.type = 'checkbox';
			

			td.appendChild(checkBox);
			linhaBody.appendChild(td);

			checkBoxes.push(checkBox);
			console.log(checkBox);
		}
		tableBody.appendChild(linhaBody);
	}

	tblDiv.appendChild(table);
	let botaoEnviar = document.createElement('button');
	botaoEnviar.type = 'button';
	botaoEnviar.textContent = 'Enviar';
	botaoEnviar.onclick = enviaMaquina;
	document.getElementById('botaoEnviar').appendChild(botaoEnviar);
}


function enviaMaquina(){
	const maquina = {};
	maquina.registers = qtdRegistradores;
	for (let i = 0; i < checkBoxes.length; i++){
		let valores = checkBoxes[i].checked;
		console.log(valores);
	}
	
	

	console.log(JSON.stringify(maquina));
	// window.location.href = 'programa.html'
}