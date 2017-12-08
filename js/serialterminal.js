
var debug = true;

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
var buf = Buffer.from([255,0,3,1,3,3,12,8,9,10,11,12])

function parseLineIn(data) {
	if (debug) {
		console.log("rl: parseLineIn: " + data);
	}
	if(data == 'packet'){
		console.log('packet out !');
		data_out(buf);
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