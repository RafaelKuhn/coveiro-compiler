console.log("temo na pagina do compiuter")

const params = new URLSearchParams(decodeURI(window.location.search))

// const rawMachine = params.get("m").replace(/'/g, "")
// const rawProgram = params.get("p").replace(/'/g, "")

//  TODO: get json code from url
// const dataWithLiteralLBs = rawProgram.replace(/<EOL>/g, "\n")

// document.getElementById("codezao").textContent = `código:\n\n${dataWithLiteralLBs}`

// MÁQUINA
const machine = {
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


// MONOLÍTICO
const program = {
	"lines": 16,
	"expressions": [
		null,
		{ // 2
			"type": "if",
			"condition": "a_zero",
			"onTrue": 5,
			"onFalse": 0
		},
		null, null,
		{ // 5
			"type": "if",
			"condition": "b_zero",
			"onTrue": 11,
			"onFalse": 6
		},
		{ // 6
			"type": "call",
			"what": "c_add",
			"then": 7
		},
		{ // 7
			"type": "call",
			"what": "d_add",
			"then": 8
		},
		{ // 8
			"type": "call",
			"what": "b_sub",
			"then": 5
		},
		null, null,
		{ // 11
			"type": "if",
			"condition": "c_zero",
			"onTrue": 16,
			"onFalse": 12
		},
		{ // 12
			"type": "call",
			"what": "b_add",
			"then": 13
		},
		{ // 13
			"type": "call",
			"what": "c_sub",
			"then": 11
		},
		null, null,
		{ // 16
			"type": "call",
			"what": "a_sub",
			"then": 2
		},
	]
}


document.getElementById("codezao").textContent = `código:\n\n${JSON.stringify(program)}`

const entrada = criaEntradasDoUser()



// isso é chamado pelo botão
function computaEMostra() {
	const pre = criaOuAchaPre();
	
	const valoresDeEntrada = [];
	for (let ch_registrador in entrada) {
		valoresDeEntrada[ch_registrador] = parseInt(entrada[ch_registrador].value);
	}
	
	pre.textContent = simulaComputacao(valoresDeEntrada);
}

function simulaComputacao(entrada) {
	let a = "usando input:\n"

	for (let ch_registrador in entrada) {
		a += `${ch_registrador}: ${entrada[ch_registrador]}\n`;
	}

	a += "\nTODO: computar!"

	return a;
}



// abaixo somente boilerplate de HTML
function criaEntradasDoUser() {
	const entradas = []
	const inputersDiv = document.getElementById("inputers");
	const registradoreDeEntrada = machine.stores;
	
	registradoreDeEntrada.forEach(caractereDoRegistrador => {
		const previewEl = document.createElement("span");
		previewEl.textContent = ` ${caractereDoRegistrador.toUpperCase()}: `;
		
		const inputEl = document.createElement("input");
		inputEl.max = 255;
		inputEl.min = 0;
		inputEl.value = 0;
		
		entradas[caractereDoRegistrador] = inputEl;
		
		inputersDiv.appendChild(previewEl);
		inputersDiv.appendChild(inputEl);
	})

	return entradas;
}

/** @returns {HTMLPreElement} */
function criaOuAchaPre() {
	const preCriado = document.getElementById("runtime");
	if (preCriado) {
		return preCriado;
	}

	const runtimeContainer = document.getElementById("runtime-container");
	
	const newTitleEl = document.createElement("h2");
	newTitleEl.textContent = "Execução:"
	
	const newPreEl = document.createElement("pre");
	newPreEl.id = "runtime";
	newPreEl.textContent = "<>"
	
	runtimeContainer.appendChild(newTitleEl);
	runtimeContainer.appendChild(newPreEl);
	
	return newPreEl;
}
