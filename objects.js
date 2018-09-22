function Asteroid(segments, radius, noise){	// a constructor creating an asteroid
	this.x = context.canvas.width * Math.random();
	this.y = context.canvas.height * Math.random();
	
	this.radius = radius || 15;
	this.noise = noise || 0.4;
	
	segments = segments || 15;
	this.shape = [];
	for(var i = 0; i < segments; i++){
		this.shape.push(Math.random());
	}
	
	this.angle = 0; // because the asteroid will be rotating when floating
	this.x_speed = context.canvas.width * (Math.random() - 0.5) / 1.5;
	this.y_speed = context.canvas.height * (Math.random() - 0.5) / 1.5;
	// the sign (- or +) shows whether the asteroid spins clockwise or counterclockwise
	this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5); 
}

Asteroid.prototype.update = function (elapsed){
	this.x += this.x_speed * elapsed;
	this.y += this.y_speed * elapsed;
	
	//Checking if we are out of the canvas - the asteroid appears on the opposite side
	if(this.x - this.radius > context.canvas.width){
		this.x = -this.radius;
	}
	if(this.x + this.radius < 0){
		this.x = context.canvas.width + this.radius;
	}
	if(this.y - this.radius > context.canvas.height){
		this.y = -this.radius;
	}
	if(this.y + this.radius < 0){
		this.y = context.canvas.height + this.radius;
	}
	
	//Rotating the asteroid:
	this.angle = (this.angle + this.rotation_speed * elapsed) % (2 * Math.PI);
}

Asteroid.prototype.draw = function (context, guide){
	guide = guide || false;
	context.save();
	
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	draw_asteroid(context, this.shape, this.radius, 
		{guide: guide, noise: this.noise} );
	
	context.restore();
}

function Heart(size){	// a constructor creating a heart
	this.x = context.canvas.width * Math.random();
	this.y = context.canvas.height * Math.random();
	this.size = size || 15;
	this.radius = 8 * this.size;
	
	colors = [];
	for(var i = 95; i > 30; i -= 5){
		colors.push('hsl(0, 100%,' + i + '%)');
	}
	j = Math.round(Math.random() * 12);
	this.color = colors[j];
	
	this.angle = 0; // because the heart will be rotating when floating
	this.x_speed = (Math.random() - 0.5) * 500;
	this.y_speed = (Math.random() - 0.5) * 300;
	// the sign (- or +) shows whether the heart spins clockwise or counterclockwise
	this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5); 
}

Heart.prototype.update = function (elapsed){
	this.x += this.x_speed * elapsed;
	this.y += this.y_speed * elapsed;
	
	//Checking if we are out of the canvas - the heart appears on the opposite side
	if(this.x - this.radius > context.canvas.width){
		this.x = -this.radius;
	}
	if(this.x + this.radius < 0){
		this.x = context.canvas.width + this.radius;
	}
	if(this.y - this.radius > context.canvas.height){
		this.y = -this.radius;
	}
	if(this.y + this.radius < 0){
		this.y = context.canvas.height + this.radius;
	}
	
	//Rotating the asteroid:
	this.angle = (this.angle + this.rotation_speed * elapsed) % (2 * Math.PI);
}

Heart.prototype.draw = function (context){
	context.save();
	
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	heart_shape2(context, this.size, 1, this.color, this.color);
	
	context.restore();
}

function PacMan(x, y, radius, speed){	// a constructor creating pacman
	this.x = x;
	this.y = y;
	this.radius = radius;
	
	this.speed = speed;
	this.angle = 0; 
	this.x_speed = speed;
	this.y_speed = 0;
	
	this.time = 0;
	this.mouth = 0;
}

PacMan.prototype.turn = function(direction){
	if(this.y_speed){ // we are travelling vertically
		this.x_speed = -direction * this.y_speed;
		this.y_speed = 0;
		
		this.angle = (this.x_speed > 0) ? 0 : Math.PI;
	}
	else{
		this.y_speed = direction * this.x_speed;
		this.x_speed = 0;
		
		this.angle = (this.y_speed > 0) ? 0.5 * Math.PI : 1.5 * Math.PI;
	}
}

PacMan.prototype.turn_left = function(){
	this.turn(-1);
}

PacMan.prototype.turn_right = function(){
	this.turn(1);
}

PacMan.prototype.update = function (elapsed){
	if(Math.random() < 0.01){
		if(Math.random() < 0.5){
			this.turn_left();
		}
		else{
			this.turn_right();
		}
	}
	
	this.x += this.x_speed * elapsed;
	this.y += this.y_speed * elapsed;
	
	//Checking if we are out of the canvas - pacman appears on the opposite side
	if(this.x - this.radius > context.canvas.width){
		this.x = -this.radius;
	}
	if(this.x + this.radius < 0){
		this.x = context.canvas.width + this.radius;
	}
	if(this.y - this.radius > context.canvas.height){
		this.y = -this.radius;
	}
	if(this.y + this.radius < 0){
		this.y = context.canvas.height + this.radius;
	}
	
	this.time += elapsed;
	this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
}

PacMan.prototype.draw = function (context){
	context.save();
	
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	draw_pacman(context, this.radius, this.mouth);
	
	context.restore();
}

function Ghost(x, y, radius, speed, color){	// a constructor creating pacman
	this.x = x;
	this.y = y;
	this.radius = radius;
	
	this.speed = speed;
	this.color = color; 
}

Ghost.prototype.update = function (elapsed, target){
	var angle = Math.atan2(target.y - this.y, target.x - this.x);
	this.x_speed = Math.cos(angle) * this.speed;
	this.y_speed = Math.sin(angle) * this.speed;
	
	this.x += this.x_speed * elapsed;
	this.y += this.y_speed * elapsed;
	
	//Not Checking if we are out of the canvas - the ghost follows pacman
}

Ghost.prototype.draw = function (context){
	context.save();
	
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	draw_ghost(context, 0, 0, this.radius / 3, this.color);
	
	context.restore();
}