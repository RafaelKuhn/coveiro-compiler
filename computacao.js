console.log("temo na pagina do compiuter")

const params = new URLSearchParams(decodeURI(window.location.search))
const data = params.get("p").replace(/\"/g, "")
const dataWithLiteralLBs = data.replace(/<EOL>/g, "\n")

document.getElementById("codezao").textContent = `código:\n\n${dataWithLiteralLBs}`