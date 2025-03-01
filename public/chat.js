document.addEventListener("DOMContentLoaded", function() {
    // Connect to the socket
    var socket = io.connect('http://localhost:3000');

    // Get references to DOM elements
    var message = document.getElementById("message");
    var username = document.getElementById("username");
    var send_message = document.getElementById("send_message");
    var send_username = document.getElementById("send_username");
    var chatroom = document.getElementById("chatroom");

    // Event listener for sending a message
    send_message.addEventListener("click", function() {
        socket.emit('new_message', { message: message.value });
    });

    // Listen for new messages from the server
    socket.on("new_message", function(data) {
        console.log(data);
        var newMessage = document.createElement("p");
        newMessage.classList.add("message");
        newMessage.innerText = data.username + ": " + data.message;
        chatroom.appendChild(newMessage);
    });

    // Event listener for sending a username
    send_username.addEventListener("click", function() {
        console.log(username.value);
        socket.emit('change_username', { username: username.value });
    });
});
