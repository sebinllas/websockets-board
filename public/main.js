import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
const colorInput = document.getElementById('color-input');
const strokeWidthInput = document.getElementById('stroke-width-input');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var drawing = false;
var x, y;
var Linecolor = 'black';
var lineWidth = '4';

const socket = io('localhost:3000');
socket.on('connect', () => {
	console.log('connected to the server');
});

socket.on('data', data => {
	console.log(data);
});

socket.on('drawLineSocket', ({ x0, y0, x, y, color, width }) => {
	drawLine(x0, y0, x, y, color, width);
});

socket.on('clearBoardSocket', clearBoard);

strokeWidthInput.addEventListener('change', e => {
	lineWidth = e.target.value;
});

colorInput.addEventListener('change', e => {
	Linecolor = e.target.value;
});

clearBtn.addEventListener('click', () => {
	socket.emit('clearBoardSocket');
	clearBoard();
});

saveBtn.addEventListener('click', saveBoard);

//drawing events
canvas.addEventListener('mousedown', e => {
	x = e.clientX - canvas.offsetLeft;
	y = e.clientY - canvas.offsetTop;
	drawing = true;
});

canvas.addEventListener('mousemove', e => {
	if (drawing) {
		const newX = e.clientX - canvas.offsetLeft;
		const newY = e.clientY - canvas.offsetTop;
		drawLineSocket(x, y, newX, newY, Linecolor, lineWidth);
		drawLine(x, y, newX, newY, Linecolor, lineWidth);
		y = newY;
		x = newX;
	}
});

canvas.addEventListener('mouseup', () => {
	drawing = false;
});

canvas.addEventListener('mouseout', () => {
	drawing = false;
});

function drawLine(x0, y0, x, y, color, width) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.moveTo(x, y);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineTo(x0, y0);
	ctx.stroke();
	ctx.closePath();
}
function clearBoard() {
	canvas.width = canvas.width;
}

function saveBoard() {
	const link = document.createElement('a');
	link.download = 'download.png';
	link.href = canvas.toDataURL();
	link.click();
	link.delete;
}

function drawLineSocket(x0, y0, x, y, color, width) {
	socket.emit('drawLineSocket', { x0, y0, x, y, color, width });
}
