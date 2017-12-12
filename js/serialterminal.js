//----------------------------------------- readline
// command-line / terminal inputs are handled
// just as inputs from web terminal
// communications are kept human-friendly at network layer
// at some speed cost, but very development friendly

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', parseLineIn);

// [type][destination][destination][hopcount][source][source][#bytestotal][byte_7][byte_6]...[byte_n]
//var buf = Buffer.from([255,0,2,1,0,1,9,1,1])

// [type][destination][hopcount][source][#bytestotal][byte_7][byte_6]...[byte_n]
var buf = Buffer.from([255,1,0,0,7,1,1])

function parseLineIn(data) {
	if(data == 'packet'){
		data_out(buf);
	} else if(data.includes('packet')) {
		if(data.includes('addr') && data.includes('key') && data.includes('val')){
			console.log('parsing: ', data);
			var addr = parseInt(data.slice(data.indexOf('addr') + 5, data.indexOf(' ', data.indexOf('addr') + 5)));
			var key = parseInt(data.slice(data.indexOf('key') + 4, data.indexOf(' ', data.indexOf('key') + 4)));
			var val = parseInt(data.slice(data.indexOf('val') + 4, data.length));
			var packet = Buffer.from([255,addr,0,0,7,key,val]);
			data_out(packet);
		} else {
			console.log('no bueno commando');
		}
	} else {
		data_out(data);
	}	
}

//----------------------------------------- readline

var SerialPort = require('serialport');

var ByteLength = SerialPort.parsers.ByteLength;

var port = new SerialPort('COM4', {
	baudRate: 115200,
	dataBits: 8,
	parity: 'none',
	flowControl: false,
});

var parser = port.pipe(new ByteLength({length: 1}));

parser.on('data', data_in);

function data_in(data){
	console.log(data[0]);
}

function data_out(data){
	console.log('sent: ', data);
	port.write(data, function(err){
		if(err) {
			return console.log('Error on write: ', err.message);
		}
	});
}

port.on('error', function(err){
	console.log('Error: ', err.message);
});

/*
port.on('readable', function(){
	console.log('Data: ', port.read());
});
*/