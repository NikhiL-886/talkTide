require('dotenv').config();

const express=require('express');
const mongoose =require('mongoose');
const cookieparser=require('cookie-parser');

const cors= require('cors');
const bodyParser=require('body-parser');

const basicRoute=require('./Routes/basicRoute');
const authRoute=require('./Routes/authRoute');

const app= express();
app.set("view engine","ejs");
app.use(express.static("public"));
const PORT=process.env.PORT;
const MONGO_URL=process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(cors());
mongoose.connect(MONGO_URL)
.then(()=>console.log("Connected to mongodbDataBase using mongoose"))
.catch((error)=>console.log(error));


server =app.listen(PORT,(error)=>{
if(!error){
    console.log(`server is running fine on port :${PORT}`);

}else{
    console.log(error);
}
});
const io=require('socket.io')(server);

app.use('/',basicRoute);
app.use('/auth',authRoute);


io.on('connection', (socket)=> { 
	console.log("New user connected"); 
	socket.username="xyz"; 
	socket.on('change_username', (data)=>{ 
		socket.username = data.username; 
	});
    socket.on('new_message',(data)=>{
        io.socket.emit('new_message',{
            message:data.message,
            username:socket.username
        });
    });

}); 


