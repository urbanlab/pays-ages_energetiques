const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/control', function(request, response) {
  response.sendFile(__dirname + '/views/interface.html');
});

app.get('/result', function(request, response) {
  response.sendFile(__dirname + '/views/result.html');
});

app.get('/images', function(request, response) {
  response.sendFile(__dirname + '/views/images.html');
});

app.get('/details', function(request, response) {
  response.sendFile(__dirname + '/views/details.html');
});

/*setInterval(()=>{ 
  console.log('start')
  io.emit('start')
}, 5 * 1000);*/

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('start');
  
  socket.on('mouse', data => {
    io.emit('mouse', data);
  });

  socket.on('image', data => {
    console.log(data)
    io.emit('image', data);
  });

  socket.on('year', data => {
    io.emit('year', data);
  });
});


const listener = http.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

