function draw_grid(context, minor, major, stroke, fill){
	context.save();
	
	minor = minor || 10;
	major = major || (minor * 5);
	stroke = stroke || 'green';
	fill = fill || 'white';
	context.strokeStyle = stroke;
	context.fillStyle = fill;
	width = context.canvas.width;
	height = context.canvas.height;
	
	for(var x = 0; x < width; x += minor){
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.lineWidth = (x % major == 0) ? 0.5 : 0.25;
		context.stroke();
		if(x % major == 0) {
			context.fillText(x, x, 10);
		}
	}
	
	for(var y = 0; y < height; y += minor){
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.lineWidth = (y % major == 0) ? 0.5 : 0.25;
		context.stroke();
		if(y % major == 0) {
			context.fillText(y, 0, y + 10);
		}
	}
	
	context.restore();
}

//(x, y) is the upper point of the heart in the middle of it
// the distance between (x, y) and the rightest point of the heart is a little bit more than 2 * size
// which makes the heart aroun 4 * size wide
// the heart is around 3.2 * size long
// the distance between the middle points is exactly 2.5 * size
function heart_shape(context, x, y, size, lineWidth, stroke, fill){
	context.save();
	
	stroke = stroke || '#cc0000';
	//fill = fill || 'red';
	lineWidth = lineWidth || 1;
	size = size || 10;
	context.strokeStyle = stroke;
	context.fillStyle = fill;
	context.lineWidth = lineWidth;

	context.beginPath();
	
	context.moveTo(x, y);
	context.bezierCurveTo(x + 6 * size, y - 8 * size, 
	x + 15 * size, y + 2 * size,
		x, y + 10 * size);
			context.moveTo(x, y);
	context.bezierCurveTo(x - 6 * size, y - 8 * size, 
		x - 15 * size, y + 2 * size,
					x, y + 10 * size);
					
	if(fill != undefined){
		context.fill();
	}
	context.stroke();
	
	context.restore();
}

function heart_shape2(context, size, lineWidth, stroke, fill){
	context.save();
	
	stroke = stroke || '#cc0000';
	//fill = fill || 'red';
	lineWidth = lineWidth || 1;
	size = size || 10;
	context.strokeStyle = stroke;
	context.fillStyle = fill;
	context.lineWidth = lineWidth;

	context.beginPath();
	
	context.moveTo(0, 0);
	context.bezierCurveTo(0 + 6 * size, 0 - 8 * size, 
	0 + 15 * size, 0 + 2 * size,
		0, 0 + 10 * size);
			context.moveTo(0, 0);
	context.bezierCurveTo(0 - 6 * size, 0 - 8 * size, 
		0 - 15 * size, 0 + 2 * size,
					0, 0 + 10 * size);
					
	if(fill != undefined){
		context.fill();
	}
	context.stroke();
	
	context.restore();
}

function draw_pacman(context, radius, opening){ 	// opening - a number from 0 to 1 showing how open is the mouth
	context.save();
	
	//Body:
	context.beginPath();
	context.arc(0, 0, radius, 0.2 * opening * Math.PI, (2 - 0.2 * opening) * Math.PI);
	context.lineTo(0, 0);
	context.closePath();
	
	context.fillStyle = 'yellow';
	context.strokeStyle = 'black';
	context.lineWidth = 0.01 * radius;
	context.fill();
	context.stroke();
	
	//Eye:
	context.beginPath();
	context.arc(0, 0 - radius/2, 0.1 * radius, 0, 2 * Math.PI);
	context.fillStyle = 'black';
	context.fill();
	
	context.restore();
}



function draw_eye_ghost(context, x, y, radius, color){
	//Outer circle:
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.fillStyle = 'white';
	context.fill();
	
	//Inner circle:
	context.beginPath();
	context.arc(x - radius/3, y, radius/3, 0, 2 * Math.PI);
	context.fillStyle = color;
	context.fill();
}

function draw_ghost(context, x, y, size, color){
	context.save();
	
	//Body:
	context.beginPath();
	context.moveTo(x, y);
	context.bezierCurveTo(x - size, y - 7 * size, 
		x + 6 * size, y - 7 * size, 
				x + 5 * size, y);
	lineLength = 5 * size / 6;
	for(var i = 1; i <= 5; i++){
		height = (i % 2 == 0) ? y : y - size/2;
		context.lineTo(x + 5 * size - i * lineLength, height);
	}
	context.closePath();
	
	color = color || 'pink'
	context.fillStyle = color;
	context.strokeStyle = 'black';
	context.lineWidth = 0.1 * size;
	context.fill();
	context.stroke();
	
	//Eyes:
	draw_eye_ghost(context, x + 2 * size, y - 3.3 * size, size/2, color);
	draw_eye_ghost(context, x + 3.5 * size, y - 3.3 * size, size/2, color);
	
	context.restore();
}

function draw_spaceship(context, radius, options){
	context.save();
	
	options = options || {};
	let angle = (options.angle || 0.5 * Math.PI) / 2;
	let curve1 = options.curve1 || 0.25;
	let curve2 = options.curve2 || 0.75;
	
	if(options.guide){
		//Guiding circle:
		context.lineWidth = 0.5;
		context.strokeStyle = 'white';
		context.fillStyle = 'rgba(0,0,0,0.25)';
		
		context.beginPath();
		context.arc(0,0, radius, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	}
	
	//Spacehip:
	context.beginPath();
	context.moveTo(radius, 0);
	context.quadraticCurveTo(Math.cos(angle) * radius * curve2, Math.sin(angle) * radius * curve2,
		Math.cos(Math.PI - angle) * radius, Math.sin(Math.PI - angle) * radius);
	context.quadraticCurveTo( -radius * curve1, 0,
		Math.cos(Math.PI + angle) * radius, Math.sin(Math.PI + angle) * radius);
	context.quadraticCurveTo(Math.cos(-angle) * radius * curve2, Math.sin(-angle) * radius * curve2,
		radius, 0);
		
	context.lineWidth = options.lineWidth || 2;
	context.fillStyle = options.fill || 'black';
	context.strokeStyle = options.stroke || 'white';
	
	context.fill();
	context.stroke();
	
	if(options.guide){
		context.strokeStyle = "white";
		context.fillStyle = "white";
		context.lineWidth = 0.5;
		
		//Lines of the possibilities of the control points curving the spaceship
		context.beginPath();
		context.moveTo(-radius,0);
		context.lineTo(0,0);
		context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
		context.moveTo(0,0);
		context.lineTo(Math.cos(-angle) * radius, Math.sin(-angle) * radius);
		
		context.stroke();
		
		//Control points:
		context.beginPath();
		context.arc(-radius * curve1,0, radius/40, 0, 2 * Math.PI);
		context.fill();
		
		context.beginPath();
		context.arc(Math.cos(angle) * radius * curve2, Math.sin(angle) * radius * curve2, radius/40, 0, 2 * Math.PI);
		context.fill();
		
		context.beginPath();
		context.arc(Math.cos(-angle) * radius * curve2, Math.sin(-angle) * radius * curve2, radius/40, 0, 2 * Math.PI);
		context.fill();
	}
		
	context.restore();
}

function draw_asteroid(context, shape, radius, options){	
	context.save();
		
	options = options || {};
	context.lineWidth = options.lineWidth || 2;
	context.fillStyle = options.fill || 'black';
	context.strokeStyle = options.stroke || 'white';
	noise = options.noise || 0.1;
	
	//Asteroid:
	context.beginPath();
	for(var i = 0; i < shape.length; i++){
		context.rotate(2 * Math.PI / shape.length);
		context.lineTo(radius + radius * noise * shape[i], 0);
	}
	context.closePath();
	context.fill();
	context.stroke();
	
	if(options.guide){
		//Circle:
		context.lineWidth = 0.5;
		context.beginPath();
		context.arc(0,0, radius, 0, 2 * Math.PI);
		context.stroke();
		
		//Outer circle:
		context.lineWidth = 0.25;
		context.beginPath();
		context.arc(0,0, radius + radius * noise, 0, 2 * Math.PI);
		context.stroke();
		
		//Inner circle:
		context.beginPath();
		context.arc(0,0, radius - radius * noise, 0, 2 * Math.PI);
		context.stroke();
	}
	
	context.restore();
}