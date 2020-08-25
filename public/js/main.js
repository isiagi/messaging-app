const Chatform = document.getElementById("chat-form");
const ChatMessage = document.querySelector('.chat-messages');

//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(username);

const socket = io();

//join room
socket.emit('joinRoom', {username, room})


socket.on('message', message => {
    console.log(message);
    outputMessaga(message)

    //scroll dowm
    ChatMessage.scrollTop = ChatMessage.scrollHeight

});

Chatform.addEventListener('submit', (e)=> {
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value
    //Emit a message to Server
    socket.emit('ChatMessage', msg)
    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

function outputMessaga(message){
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username }<span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}