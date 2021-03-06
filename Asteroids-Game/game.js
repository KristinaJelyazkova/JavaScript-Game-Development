function collision(obj1, obj2){
	return distance_between(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance_between(obj1, obj2){
	return Math.sqrt(
		Math.pow(obj1.x - obj2.x, 2) +
		Math.pow(obj1.y - obj2.y, 2));
}

function AsteroidsGame(id){
	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext("2d");
	this.canvas.focus();
	
	this.guide = false;
	this.ship_mass = 10;
	this.ship_radius = 15;
	this.ship_power = 1000;
	this.ship_weapon_power = 200;
	this.asteroids_mass = 5000;
	this.asteroids_push = 500000; // max force to apply in one frame
	this.mass_destroyed = 500;
	
	this.health_indicator = new Indicator("Health", 5, 5, 100, 10);
	this.score_indicator = new NumberIndicator("Score", this.canvas.width - 10, 5);
	this.fps = 0;
	this.fps_indicator = new NumberIndicator("fps", this.canvas.width - 10, this.canvas.height - 15, {digits: 2});
	this.level_indicator = new NumberIndicator("Level", this.canvas.width / 2, 5, {align: "center"});
	
	this.message = new Message(this.canvas.width / 2, this.canvas.height / 2);
	
	this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
	this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
	
	window.requestAnimationFrame(this.frame.bind(this));

	this.reset_game();
}

AsteroidsGame.prototype.reset_game = function(){
	this.ship = new Ship(this.ship_mass, this.ship_radius, 
		this.canvas.width / 2, this.canvas.height / 2, 
		this.ship_power, this.ship_weapon_power);
	this.projectiles = [];
	this.asteroids = [];
	
	this.score = 0;
	this.game_over = false;
	this.level = 0;
	this.level_up();
}

AsteroidsGame.prototype.level_up = function(){
	this.level++;
	for(var i = 0; i < this.level; i++){
		this.asteroids.push(this.moving_asteroid());
	}
}

AsteroidsGame.prototype.moving_asteroid = function(elapsed){
	var asteroid = this.new_asteroid();
	this.push_asteroid(asteroid, elapsed);
	return asteroid;
}

AsteroidsGame.prototype.new_asteroid = function(){
	var x1 = Math.random() * this.canvas.width / 2 - 6 * this.ship.radius;
	var x2 = Math.random() * (this.canvas.width / 2 - 6 * this.ship.radius) + this.canvas.width / 2 + 6 * this.ship.radius;
	var y1 = Math.random() * this.canvas.height / 2 - 6 * this.ship.radius;
	var y2 = Math.random() * (this.canvas.height / 2 - 6 * this.ship.radius) + this.canvas.height / 2 + 6 * this.ship.radius;
	var x = x1, y = y1;
	
	if(Math.random() > 0.5){
		x = x2;
	}
	if(Math.random() > 0.5){
		y = y2;
	}
	
	return new Asteroid(
		this.asteroids_mass,
		x, 
		y);
}

AsteroidsGame.prototype.push_asteroid = function(asteroid, elapsed){
	elapsed = elapsed || 0.015;
	asteroid.push(2 * Math.PI * Math.random(), this.asteroids_push, elapsed);
	asteroid.twist((Math.random() - 0.5) * Math.PI * this.asteroids_push * 0.02, elapsed);
}

AsteroidsGame.prototype.keyDown = function(event){
	this.key_handler(event, true);
}

AsteroidsGame.prototype.keyUp = function(event){
	this.key_handler(event, false);
}

AsteroidsGame.prototype.key_handler = function(event, value){
	let key = event.key || event.keyCode;
	let nothing_handled = false;
	switch(key){
		case "ArrowUp": case 38:
			this.ship.thruster_on = value; 
			break;
		case "ArrowDown": case 40:
			this.ship.retro_on = value; 
			break;
		case "ArrowLeft": case 37:
			this.ship.left_thruster = value;
			this.ship.stop_rotating = !value;
			break;
		case "ArrowRight": case 39:
			this.ship.right_thruster = value;
			this.ship.stop_rotating = !value;
			break;
		case "g": case 71: case 'g': case "G": case 'G':
			if(value) {
				this.guide = !this.guide;
			}
			break;
		case " ": case 32:
			if(this.game_over){
				this.reset_game();
			}
			else{
				this.ship.trigger = value;
			}
			break;
		default: nothing_handled = true;
	}
	if(!nothing_handled){
		event.preventDefault();
	}
}

AsteroidsGame.prototype.frame = function(timestamp){
	if(!this.previous){
		this.previous = timestamp;
	}
	var elapsed = timestamp - this.previous;
	this.fps = 1000 / elapsed;
		
	this.draw();
	this.update(elapsed / 1000);
	this.previous = timestamp;
				
	window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.draw = function(){
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	if(this.guide){
		draw_grid(this.context);
		this.fps_indicator.draw(this.context, this.fps);
	}
	
	this.health_indicator.draw(this.context, this.ship.max_health, this.ship.health);
	this.score_indicator.draw(this.context, this.score);
	this.level_indicator.draw(this.context, this.level);
	
	this.asteroids.forEach(function(asteroid){
		asteroid.draw(this.context, this.guide);
	}, this);
	
	if(this.game_over){
		this.message.draw(this.context, "GAME OVER", "Press space to play again");
		return;
	}
	
	this.projectiles.forEach(function(projectile){
		projectile.draw(this.context, this.guide);
	}, this);
	
	this.ship.draw(this.context, this.guide);
}

AsteroidsGame.prototype.update = function(elapsed){
	if(this.asteroids.length == 0){
		this.level_up();
	}
	
	this.ship.compromised = false;
	
	this.asteroids.forEach(function(asteroid){
		asteroid.update(elapsed, this.context);
		if(collision(asteroid, this.ship)){
			this.ship.compromised = true;
		}
	}, this);
	
	if(this.ship.health <= 0){
		this.game_over = true;
		return;
	}
	
	this.ship.update(elapsed, this.context);
	
	this.projectiles.forEach(function(projectile, i, projectiles){
		projectile.update(elapsed, this.context);
		if(projectile.life <= 0){
			projectiles.splice(i, 1);
		}
		else{
			this.asteroids.forEach(function(asteroid, j){
				if(collision(projectile, asteroid)){
					projectiles.splice(i, 1);
					this.asteroids.splice(j, 1);
					this.split_asteroid(asteroid, elapsed);
				}
			}, this);
		}
	}, this);
	
	if(this.ship.trigger && this.ship.loaded){
		this.projectiles.push(this.ship.projectile(elapsed));
	}
}

AsteroidsGame.prototype.split_asteroid = function(asteroid, elapsed){
	asteroid.mass -= this.mass_destroyed;
	this.score += this.mass_destroyed;
	
	var split = 0.25 + 0.5 * Math.random();
	var ch1 = asteroid.child(asteroid.mass * split, 1);
	var ch2 = asteroid.child(asteroid.mass * (1 - split), -1);
	
	[ch1, ch2].forEach(function(child, i){
		if(child.mass < this.mass_destroyed){
			this.score += child.mass;
		}
		else{
			this.push_asteroid(child, elapsed);
			this.asteroids.push(child);
		}
	}, this);
}