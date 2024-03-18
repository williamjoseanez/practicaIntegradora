// chat-box
const socket = io();

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identifícate",
  html:
    '<input id="username" class="swal2-input" placeholder="Usuario">' +
    '<input id="password" type="password" class="swal2-input" placeholder="Contraseña">',
  inputValidator: (value) => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    return (
      (!username || !password) &&
      "Necesitas ingresar usuario y contraseña para continuar"
    );
  },
  allowOutsideClick: false,
}).then((result) => {
  if (result.isConfirmed) {
    const username = document.getElementById("username").value;
    // Envía solo el nombre de usuario al servidor para la autenticación.
    socket.emit("authenticate", { username });
    user = username;
  }
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      //trim nos permite sacar los espacios en blanco del principio y del final de un string.
      //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor.
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

//Listener de Mensajes:

socket.on("message", (data) => {
  let log = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message} <br>`;
  });

  log.innerHTML = messages;
});

// ////////////////////////////////////jwt
const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

  let obj = { user, pass };

  fetch("/loginjwt", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
      // "Authorization" : `Bearer ${}`
    },
  })
    // .then((result = result.json()))
    // .then((json) => {
    //   localStorage.setItem("authToken", json.token);
    // });
});
