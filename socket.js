import io from "socket.io-client";

let socket; // Declare socket variable outside the scope
let isConnected = false;

// JS Functionality

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const connectButton = document.getElementById("connect-socket");
const disconnectButton = document.getElementById("disconnect-socket");
const divform = document.getElementById("div-form");
const divconnetform = document.getElementById("divconnect-form");

function displayMessage(obj) {
  console.log(obj);
  const outerDiv = document.getElementById("message-container");
  let html =
    "<label class='message-label'>" +
    obj.user +
    "</label> : <span class='message-content'>" +
    obj.message +
    "</span><small class='message-time'>" +
    obj.time +
    "</small>";
  const div = document.createElement("div");
  div.innerHTML = html;
  outerDiv.prepend(div);
}

function showdivconnetform() {
  divconnetform.style.display = "none";
  divform.style.display = "block";
  $("#div_details").show();
}
function hidedivconnetform() {
  divconnetform.style.display = "block";
  divform.style.display = "none";
  $("#div_details").hide();
}

function showDisconnectButton() {
  disconnectButton.style.display = "block";
  connectButton.style.display = "none";
}

function hideDisconnectButton() {
  disconnectButton.style.display = "none";
  connectButton.style.display = "block";
}

function connectSocket(url) {
  // Connect to the provided URL
  socket = io(url);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("connect", () => {
    showdivconnetform();
    var _u = localStorage.getItem("user");
    $("#connection-status").html(`${_u} Connect with ID :  ${socket.id}`);
    //displayMessage(`You Connect with ID ${socket.id}`);
  });

  socket.on("disconnect", () => {
    hideDisconnectButton();
    isConnected = false;
  });

  socket.on("receive-message", (message) => {
    displayMessage(message);
  });
}

connectButton.addEventListener("click", () => {
  const url = document.getElementById("connect-url").value;
  const name = document.getElementById("name").value;
  if (!name) return alert("Please Enter Your Name");
  localStorage.setItem("user", name);
  if (url) {
    connectSocket(url);
  } else {
    alert("Please Enter Socket URI");
  }
});

disconnectButton.addEventListener("click", () => {
  if (socket) {
    socket.disconnect();
    hidedivconnetform();
  }
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  var currentTime = moment().format("HH:mm A");
  var _u = localStorage.getItem("user");
  if (messageInput.value === "") return;
  const message = _u + " :" + messageInput.value + " " + currentTime;
  const _m = {
    message: messageInput.value,
    user: _u,
    time: currentTime,
  };
  const room = roomInput.value;
  displayMessage(_m);
  socket.emit("send-message", _m, room);
  messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;
  if (e.key === "d" && socket) socket.disconnect();
});

// Different Users
const userSocket = io("http://localhost:3011/user", {
  auth: { token: "test" },
});

userSocket.on("connect_error", (err) => {
  displayMessage(`connect_error due to ${err.message}`);
});
