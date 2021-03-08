var connected = false;

var socket = io("http://127.0.0.1:3003/");

socket.emit('setup',userLoggedInData);

socket.on("connected",()=>{
    connected =  true;
});

socket.on("message received",(newMessage)=> messageRecived(newMessage));


