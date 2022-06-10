console.log("temo na página do maquinario");

function contabiliza() {
	alert(`vamo gera o maquinário com ${document.getElementById("quantidadeRegs").value}`)

	var qtdRegistradores = document.getElementById("qtdRegistradores");
}

function criaTabela() {
	var tblDiv = document.getElementById("tabela");
	var table = document.createElement('table');
	table.border = '1px';
	table.style.width = '50%'

	var tableHead = document.createElement('thead');
	table.appendChild(tableHead);
	var tableIndex = ['Registrador', 'Armazena', 'Retorna', 'Checa Zero', 'Soma', 'Subtração', 'Multiplica'];
	var linhaHead = document.createElement('tr');
	for (let col = 0; col < tableIndex.length; col++) {
		var th = document.createElement('th');
		th.textContent = tableIndex[col];
		linhaHead.appendChild(th);
	}
	tableHead.appendChild(linhaHead);
	
	var tableBody = document.createElement('tbody');
	table.appendChild(tableBody);
	for (var linha = 0; linha < tableIndex.length; linha++) {
		linhaBody = document.createElement('tr');

		for (let coluna = 0; coluna < tableIndex.length[linha]; coluna++) {
			td = document.createElement('td');
			td.textContent = '';
			linhaBody.appendChild(td);
		}
		tableBody.appendChild(linhaBody);
	}

	tblDiv.appendChild(table);
}
criaTabela();