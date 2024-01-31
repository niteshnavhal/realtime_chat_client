import io from "socket.io-client";

const socket = io("http://localhost:3011");

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("connect", () => {
  displayMessage(`You Connect with ID ${socket.id}`);
});

socket.on("receive-message", (messgae) => {
  displayMessage(messgae);
});

// JS Functionality
const joinroonButtom = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");

function displayMessage(message) {
  const outerDiv = document.getElementById("message-container");
  const div = document.createElement("div");
  div.textContent = message;
  outerDiv.prepend(div);
}

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") return;

  displayMessage(message);
  socket.emit("send-message", message, room);
  messageInput.value = "";
});

joinroonButtom.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

let count = 0;
// setInterval(() => {
//   socket.volatile.emit("ping", ++count);
// }, 1000);
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;
  if (e.key === "c") socket.connect();
  if (e.key === "d") socket.disconnect();
});

//different Users
const usersocket = io("http://localhost:3011/user", {
  auth: { token: "test" },
});

usersocket.on("connect_error", (err) => {
  displayMessage(`connect_error due to ${err.message}`);
});
