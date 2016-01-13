// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
var config = JSON.parse(require('fs').readFileSync('./test.json', 'utf8'));
var port = 3030; 
var lights = config.ledtest.Led;
var buttons = config.ledtest.button;
var potentiometer;
var potValue;
var ledData;
var led=[];

app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');        
});

app.get('/lights', function(req,res){
    'use strict';
    res.send(lights);
});

httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  

//Arduino board connection
 
var board = new five.Board({port: "COM6"});  
board.on("ready", function() {  
    console.log('Arduino connected');
    
    for(number in lights){
            //
            if(lights[number].hasOwnProperty('pin')){
                led[number]+=lights[number].name;
            led[number]= new five.Led(lights[number].pin);
            }
        }

    potentiometer = new five.Sensor({
        pin: "A0",
        freq: 250
    })

    Object.keys(buttons).forEach(function(key) {
    var pin = buttons[key].pin;

    this.pinMode(pin, five.Pin.INPUT);
    this.digitalRead(pin, function(data) {
     // Catpure the initial pin value
      if (buttons[key].value === null) {
        buttons[key].value = data;
      }

      // Something changed
      if (buttons[key].value !== data) {
        console.log(pin, key);
        io.sockets.emit('up', {value: key});
      }
      buttons[key].value = data;
        //console.log(buttons[key].status);
    });
  }, this);      
});

//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);

        io.sockets.emit('light', lights); //broadcast lights model
        io.sockets.emit('button', buttons);

        socket.on('lights.update', function(data){
          lights = data;
          io.sockets.emit('light', lights); //broadcast lights model
            //console.log(data);
        })
      
        socket.on('led:on', function (data) {
          ledData = data;
          //lights = {$set:{'lights.$.name':ledData,'lights.$.status':'on'}};
          
        for(exKey in lights){
            //
            if(lights[exKey].name === ledData){
            lights[ledData].status = 'on';
            led[exKey].on();
            }
        }                 
        console.log('LED ON RECEIVED');
        io.sockets.emit('led:on', {value: ledData});
        });
 
        socket.on('led:off', function (data) {
          ledData = data;
        for(exKey in lights){
            //
            if(lights[exKey].name === ledData){
            lights[ledData].status = 'off';
            led[exKey].off();
            }
        }
        console.log('LED OFF RECEIVED');
        io.sockets.emit('led:off', {value: ledData});
        });

        potentiometer.on("data", function(){
            potValue = this.value;
            io.sockets.emit('potentiometer', {value: potValue});
        });

        socket.emit('potentiometer', {value: potValue});
        });
 
console.log('Waiting for connection');