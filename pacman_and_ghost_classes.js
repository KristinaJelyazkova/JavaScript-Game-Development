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

PacMan.prototype.update = function (elapsed){
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

PacMan.prototype.move_right = function(){
	this.x_speed = this.speed;
	this.y_speed = 0;
	this.angle = 0;
}

PacMan.prototype.move_left = function(){
	this.x_speed = -this.speed;
	this.y_speed = 0;
	this.angle = Math.PI;
}

PacMan.prototype.move_down = function(){
	this.x_speed = 0;
	this.y_speed = this.speed;
	this.angle = 0.5 * Math.PI;
}

PacMan.prototype.move_up = function(){
	this.x_speed = 0;
	this.y_speed = -this.speed;
	this.angle = 1.5 * Math.PI;
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