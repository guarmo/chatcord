const form = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on("message", (message) => {
//   console.log(message, username, room);
  outputMessage(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //   // Getting the message from client
  const msg = e.target.elements.msg.value;

  //   // Emitting msg to server
  await socket.emit("chatMessage", msg);

  //   Clear field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to dom
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">
  ${message.username} <span>${message.time}</span>
    </p>
    <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

// Add room name to dom
const outputRoomName = (room) => {
    roomName.innerHTML = room
}

// Add users to dom
const outputUsers= (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}