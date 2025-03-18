const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));


const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);


const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


let socketConnection;

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    if (!socketConnection) {
        socketConnection = socket;
        console.log('Socket connection established for the session');
    }

    
    socket.on('startSimulation', () => {
        io.emit('simulationStarted'); 
    });

    
    socket.on('setAlarm', () => {
        io.emit('technicalServiceStatus', { status: false });
    });

    socket.on('clearAlarm', () => {
        io.emit('technicalServiceStatus', { status: true });
    });

    
    socket.on('loadLabel', () => {
        io.emit('labelDoorsToggled', { status: true });
    });

    
    socket.on('loadTube', (data) => {
        const side = data.side === '1' ? 'side1' : 'side2';
        io.emit('tubeDoorsToggled', { side });
    });

    
    socket.on('printLabel', (data) => {
        io.emit('labelPrinted', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
