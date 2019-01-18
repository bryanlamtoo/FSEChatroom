var socket = io.connect();


//Access the dom objects
const message = document.getElementById('message');

const curr_userId = document.getElementById('currentUser');
const curr_userName = document.getElementById('currentUserName');


const sendBtn = document.getElementById('send');

const output = document.getElementById('msg_history');

var feedback = document.getElementById('feedback');

//Add listeners
sendBtn.addEventListener('click', function () {

    socket.emit('chat', {
        message: message.value,
        userId: curr_userId.value
    });

    output.innerHTML += '<div class="outgoing_msg"><div class="sent_msg"><p>' + message.value + '</p><span class="time_date">' + curr_userName.value + '    |    ' + new Date() + '</span></div></div>';


});

//Add typing event listener
message.addEventListener('keypress', function () {
    socket.emit('typing', curr_userName.value);
});


socket.on('chat', function (data) {

    console.log('Received' + data);

    output.innerHTML += '<div class="received_msg"><div class="received_withd_msg"><p>' + data.message + '</p><span class="time_date">' + data.name + '    |    ' + data.date + '</span></div></div>';


    //     <div class="outgoing_msg"> '+data.username+':'+'</strong>'
    //     <div class="sent_msg">
    //     <p>Test which is a new approach to have all
    // solutions</p>
    // <span class="time_date"> 11:01 AM    |    June 9</span></div>
    // </div>
    //

    feedback.innerHTML = "";
})

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + " is typing...</em></p>";
})