// var http = require('http');
var hipchat = require('node-hipchat');
//From https://github.com/nkohari/node-hipchat
var HC = new hipchat('7bdca640950faeb9072fb15cbaea78');
//From https://github.com/websockets/ws
var WebSocket = require('ws');
//Binary websocket
var ws = new WebSocket('wss://ws.binary.com/websockets/contracts');

ws.on('open', function open() {
  ws.send('something');
  // ws.send(JSON.stringify({authorize: "0d4abc3j3MTabcQJnmabcactabd"}));
  ws.send(JSON.stringify({ticks:'frxUSDJPY'}));
});

var rate = 0.0;

ws.onmessage = function(msg) {
  var data = JSON.parse(msg.data);
  // console.log('ticks update: ', data);
  console.log("USD to JPY: " + data.tick.quote);
  if(rate == 0.0) {
    rate = data.tick.quote;
    console.log(rate);
  }
  if (data.tick.quote >= rate*1.05) {
    sendMsgToHC(data.tick.quote);
  }
  setInterval(
    function(){ 
      rate = 0.0; 
    }
    , 600000);
};


//http server stuff
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World from Cloud9\n');
// }).listen(process.env.PORT);

//For listing room
// HC.listRooms(function(data) {
//   console.log(data); // These are all the rooms
// });

function sendMsgToHC(rate) {
  var params = {
    room: 1876355, // Found in the JSON response from the call above
    from: 'FunkyMonkey',
    message: 'The USD/JPY exhange rate has rise more than 0.5% ' +
    'in this 10 minute period. Current rate: ' + rate,
    color: 'yellow'
  };
  
  HC.postMessage(params, function(data) {
    // Message has been sent!
    console.log("Message sent: " + params.message);
  });
}

