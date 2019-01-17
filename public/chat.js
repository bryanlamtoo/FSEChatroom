
var socket = io.connect('http://localhost:3000');


//Acces the dom objects
var message = document.getElementById('message');
var username = document.getElementById('username');
var sendBtn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

//Add listeners
sendBtn.addEventListener('click',function(){
    socket.emit('chat',{
        message:message.value,
        username:username.value
    })
});

//Add typing event listener
message.addEventListener('keypress', function(){
    socket.emit('typing',username.value);
});


socket.on('chat',function(data){
    output.innerHTML += '<p><strong>'+data.username+':'+'</strong>'+data.message+'</p>'
    feedback.innerHTML = "";
})

socket.on('typing',function(data){
    feedback.innerHTML = '<p><em>'+data+" is typing...</em></p>";
})