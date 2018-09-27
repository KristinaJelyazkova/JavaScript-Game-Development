// the parent class of all objects is mass
function Mass(x, y, mass, radius, angle, x_speed, y_speed, rotation_speed){
	this.x = x;
	this.y = y;
	this.mass = mass || 1;
	this.radius = radius || 50;
	this.angle = angle || 0;  // the angle between Ox and the mass
	this.x_speed = x_speed || 0;
	this.y_speed = y_speed || 0;
	this.rotation_speed = rotation_speed || 0;
}

// elapsed is the elapsed time between the frame and the previous frame
// it is evaluated in the global frame function
Mass.prototype.update = function(elapsed, ctx){
	// we multiply with elapsed (whi)
	this.x += this.x_speed * elapsed;
	this.y += this.y_speed * elapsed;
	
	// Checking if the mass is out of the canvas
	// the mass wraps around the canvas - when it disappears on one side it appears on the opposite
	if(this.x - this.radius > ctx.canvas.width){
		this.x = -this.radius;
	}
	if(this.x + this.radius < 0){
		this.x = ctx.canvas.width + this.radius;
	}
	if(this.y - this.radius > ctx.canvas.height){
		this.y = -this.radius;
	}
	if(this.y + this.radius < 0){
		this.y = ctx.canvas.height + this.radius;
	}
	
	this.angle += (this.rotation_speed * elapsed);
	this.angle %= (2 * Math.PI);
}

//Newton's second law - the force with witch an object is pushed is equal to its mass multiplied by the acceleration it causes
// F = m * a
// the angle is the angle between 0x and the direction of the force
// we multiply with sin or cos(angle) because the angle of the force shows how the direction of the mass changes
Mass.prototype.push = function(angle, force, elapsed){
	this.x_speed += (Math.cos(angle) * force / this.mass) * elapsed;
	this.y_speed += (Math.sin(angle) * force / this.mass) * elapsed;
}

// positive forces rotate the mass clockwise
// and negative forces rotate the mass counterclockwise
Mass.prototype.twist = function(force, elapsed){
	this.rotation_speed += (force / this.mass) * elapsed;
}

// Pythagor's theorem for calculating the speed of the mass
Mass.prototype.speed = function(){
	return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
}

// the angle between Ox and the direction of the movement of the mass
Mass.prototype.movement_angle = function(){
	return Math.atan2(this.y_speed, this.x_speed);
}

// this method will be overriden in child classes
Mass.prototype.draw = function(ctx){
	ctx.save();
	
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	
	ctx.beginPath();
	context.arc(0, 0, this.radius, 0, 2 * Math.PI);
	context.lineTo(0, 0);
	
	context.strokeStyle = 'white';
	context.stroke();
	
	ctx.restore();
}



// makes a child class inherit its parent class
function extend(ChildClass, ParentClass){
	var parent = new ParentClass();
	ChildClass.prototype = parent;
	ChildClass.prototype.super = parent.constructor;
	ChildClass.prototype.constructor = ChildClass;
}




// the asteroid class - a child class of mass
function Asteroid(mass, x, y, x_speed, y_speed, rotation_speed){
	var density = 1;
	// the mass is equal to the volume multiplied by the density of the object
	var volume = mass / density;
	// volume = area of a circle = pi * radius * radius;
	var radius = Math.sqrt(volume / Math.PI);
	this.super(x,y, mass, radius, 0, x_speed, y_speed, rotation_speed);
	
	this.circumference = 2 * Math.PI * radius;
	// We want larger asteroids to have more segments because we want them to be more detailed
	this.segments = Math.ceil(this.circumference / 15);
	// The segments are between 5 and 25
	this.segments = Math.min(25, Math.max(5, this.segments));
	
	this.noise = 0.2;
	this.shape = [];
	for(var i = 0; i < this.segments; i++){
		this.shape.push(2 * (Math.random() - 0.5));
	}
}

// In this way we make the asteroid inherit the mass class
extend(Asteroid, Mass);

Asteroid.prototype.draw = function(ctx, guide){
	ctx.save();
	
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	
	draw_asteroid(ctx, this.shape, this.radius, {noise: this.noise, guide: guide});
	
	ctx.restore();
}


// the ship class inherits the mass class
function Ship(mass, radius, x, y, power, weapon_power){
	this.super(x, y, mass, radius, 1.5 * Math.PI);
	
	this.thruster_power = power;
	this.thruster_on = false;
	this.right_thruster = false;
	this.left_thruster = false;
	
	this.steering_power = power / 2;  
	
	this.weapon_power = weapon_power || 200;
	this.trigger = false;
	this.loaded = false;
	this.weapon_reload_time = 0.25;
	this.time_until_reloaded = this.weapon_reload_time;
	
	this.stop_rotating = false;
}

extend(Ship, Mass);

Ship.prototype.twist = function(force, elapsed){
	if(this.stop_rotating){
		this.rotation_speed = 0;
	}
	else{
		Mass.prototype.twist.apply(this, arguments);
	}
}

Ship.prototype.update = function(elapsed){
	this.push(this.angle, this.thruster_on * this.thruster_power, elapsed);
	this.twist(this.steering_power * (this.right_thruster - this.left_thruster), elapsed);
	this.loaded = (this.time_until_reloaded === 0);
	if(!this.loaded){
		this.time_until_reloaded -= Math.min(elapsed, this.time_until_reloaded);
	}
	Mass.prototype.update.apply(this, arguments);
}

Ship.prototype.draw = function(ctx, guide){
	ctx.save();
	
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	
	draw_spaceship(ctx, this.radius, {guide: guide, thruster: this.thruster_on});
	
	context.strokeStyle = 'white';
	context.stroke();
	
	ctx.restore();
}

Ship.prototype.projectile = function(elapsed){
	var projectile = new Projectile(0.025, 1, this.x + Math.cos(this.angle) * this.radius, 
		this.y + Math.sin(this.angle) * this.radius, this.x_speed, this.y_speed, this.rotation_speed);
		
	projectile.push(this.angle, this.weapon_power, elapsed);
	projectile.twist(this.weapon_power / 50, elapsed);
	
	this.push(this.angle + Math.PI, this.weapon_power, elapsed);
	
	this.time_until_reloaded = this.weapon_reload_time;
	
	return projectile;
}



function Projectile(mass, lifetime, x, y, x_speed, y_speed, rotation_speed){
	var density =  0.001;
	var volume = mass / density;
	var radius = Math.sqrt(volume / Math.PI);
	this.super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);
	this.lifetime = lifetime;
	this.life = 1.0;
}

extend(Projectile, Mass);

Projectile.prototype.update = function(elapsed, ctx){
	this.life -= (elapsed / this.lifetime);
	Mass.prototype.update.apply(this, arguments);
}

Projectile.prototype.draw = function(ctx, guide){
	ctx.save();
	
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	draw_projectile(ctx, this.radius, this.life, guide);
	
	ctx.restore();
}