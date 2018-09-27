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
	
	//Drawing fire behind the spaceship every time the thruster is on
	if(options.thruster){
		context.beginPath();
		context.moveTo(Math.cos(Math.PI + angle * 0.8) * radius / 2, Math.sin(Math.PI + angle * 0.8) * radius / 2);
		context.quadraticCurveTo(-radius * 2, 0,
			Math.cos(Math.PI - angle * 0.8) * radius / 2, Math.sin(Math.PI - angle * 0.8) * radius / 2);
		context.closePath();
		
		context.fillStyle = 'red';
		context.strokeStyle = 'yellow';
		context.lineWidth = 3;
		context.fill();
		context.stroke();
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

function draw_projectile(context, radius, life, guide){
	context.save();
	
	if(guide){
		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.beginPath();
		context.arc(0, 0, radius, 0, 2 * Math.PI);
		context.stroke();
	}
	
	var segments = 5;
	var angle = 2 * Math.PI / segments;
	context.beginPath();
	for(var i = 0; i < segments; i++){
		context.lineTo(radius, 0);
		context.rotate(angle);
	}
	context.closePath();
	
	context.fillStyle = "rgb(100%, 100%," + (100 * life) + "%)";
	context.fill();
	
	context.restore();
}