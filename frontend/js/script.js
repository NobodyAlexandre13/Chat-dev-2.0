const login = document.querySelector(".login")
const formulario = login.querySelector(".login_form")
const input = formulario.querySelector(".nome")
const btn = formulario.querySelector(".entrarBTN")

const chat = document.querySelector(".chat")
const chatFormulario = chat.querySelector(".chat_form")
const chatInput = chatFormulario.querySelector(".msg")
const chatBTN = chatFormulario.querySelector(".enviarBTN")

const online = document.querySelector(".online")

const smsend = document.querySelector(".smsend")

const usuario = {id: "", nome: ""}


let websocket

function caixasSMSMinha(conteudo){
    const div = document.createElement("div")
    div.classList.add("Msms")

    div.innerHTML = conteudo

    return div

}
function caixasSMSTu(nome, conteudo){
    const button = document.createElement("button")
    const div = document.createElement("div")
    const span = document.createElement("span")


    div.classList.add("Msms")
    div.classList.add("Osms")

    span.classList.add("quem_envio")
    button.classList.add("ouvir")

    div.appendChild(span)


    span.innerHTML += nome
    button.innerHTML += `<i class="bi bi-volume-up-fill"></i>`
    div.innerHTML += conteudo

    div.appendChild(button)

    button.addEventListener("click", ()=>{
        ouvir = new SpeechSynthesisUtterance(conteudo)
        speechSynthesis.speak(ouvir);
    })

    return div

}

function scroll(){
    window.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    })
}

function processarSMS({data}){
    const {userId, userNome, corpo} = JSON.parse(data)

    const messege = 
        userId == usuario.id 
        ? caixasSMSMinha(corpo) 
        : caixasSMSTu(userNome, corpo)
    
    smsend.appendChild(messege)
    scroll()

}

const FazerLogin = (event) => {
    event.preventDefault()

    if(input.value === ""){
        alert("Por faor Digite o teu nome para poder entar")
    }else{
        usuario.id = crypto.randomUUID()
        usuario.nome = input.value
    
        login.style.display = "none"
        chat.style.display = "flex"
    
        websocket = new WebSocket("wss://chat-beckend-awh3.onrender.com")

        websocket.onmessage = processarSMS
    }
}

function enviarSMS(event){
    event.preventDefault()
    if(chatInput.value === ""){

    }else{
        const mensagem = {
            userId: usuario.id,
            userNome: usuario.nome,
            corpo: chatInput.value
        }

        websocket.send(JSON.stringify(mensagem))
    
        chatInput.value = ""
    }

}

btn.addEventListener("click", FazerLogin)
chatBTN.addEventListener("click", enviarSMS)
