
const socket=io('http://localhost:8000');

const form=document.getElementById('sendContainer');
const messageInp=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');
var audioMessage =new Audio('./audio/click.mp3');

const appendMessage=(message,position)=>{
    const div = document.createElement('div');
    div.innerText=message;
    div.classList.add('message')
    div.classList.add(position)
    messageContainer.append(div)
    if(position===left){
        audioMessage.play();
    }
   
}
const appendUser=(message,position)=>{
    const div = document.createElement('div');
    div.innerText=message;
    div.classList.add('User')
    div.classList.add(position)
    messageContainer.append(div)
}

const username= prompt("enter your name to join")

socket.emit('new-user-joined',username)

socket.on('user-joined',data=>{
appendUser(`${data.message}`,'left')
});

socket.on('receive',data=>{
appendMessage(`${data.username}:${data.message}`,'left')
});

socket.on('leave',data=>{
appendUser(`${data.username} left the chat`,'left')
});

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInp.value;
    appendMessage(`You:${message}`,'right');
    socket.emit('send',message);
    messageInp.value='';
})