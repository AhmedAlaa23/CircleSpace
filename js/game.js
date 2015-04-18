function circle(x, y, r, col){
	this.x = x;
	this.y = y;
	this.r = r;
	this.color = col;
	// normal cirs NO: 1, special cirs NO: 2, when a special cir is taken it's NO: 3
	if(col=="red" || col=="green" || col=="blue" || col=="yellow"){
		this.t=2;
	}
	else{
		this.t=1;
	}
	
	this.render = function(ctx){
		ctx.beginPath();
		if(this.t==2){
			ctx.arc(this.x, this.y, this.r, 0, 6.2831);
			ctx.lineWidth = 3;
			ctx.strokeStyle = this.color;
			ctx.stroke();
		}
		else{
			ctx.arc(this.x, this.y, this.r, 0, 6.2831);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
		ctx.closePath();
	}
}

var colors = ["#7B1939","#227778","#D14D2B","#5c330a","#30c9e8","#5c230a","red","#852C6E","#568239","blue","#41A4B3","green","#69969D","#6311A0","#A20751","#C90C67","yellow","#DA5124","#D4C136","brown","#CF233B","orange"];

var cw=0;
var ch=0;
var gover = 0;
var p = -1;
var mvx = 0;
var cvy = 3;
var rad = 0;
var specialtime = 0;
var score = 0;
var isspecial = 0;
var musicno = 0;
var animesup = 0;

function init(){
	if(window.requestAnimationFrame){
		animesup = 1;
	}
	
	var m1 = document.getElementById("m1");
	if(localStorage.sound == "1" || localStorage.getItem("sound") == null ){
		m1.play();
		musicno = 1;
	}
	
	var ctx = document.getElementById("canv").getContext("2d");
	ctx.canvas.width  = 500//window.innerWidth;
	ctx.canvas.height  = window.innerHeight;
	cw = ctx.canvas.width;
	ch = ctx.canvas.height;
	
	// tale canv
	var talectx = document.getElementById("talecanv").getContext("2d");
	talectx.canvas.width  = 500//window.innerWidth;
	talectx.canvas.height  = window.innerHeight;
	
	//get score element
	var showscore = document.getElementById("score");
	
	var mcirsize = Math.round(cw/80);
	var mcir = new circle(cw/2, ch-120, mcirsize, "black");
	
	var cirs = [];
	
	var talecir = [];
	
	cirs.push(new circle(cw/2, -10, cw/50, "brown"));
	
	function animate(){
		ctx.clearRect(0,0,cw,ch);
		talectx.clearRect(0,0,cw,ch);
		
		for(var i=0; i<cirs.length; i++){
			
			cirs[i].y += cvy;
			
			cirs[i].render(ctx);
			
			// game over
			rad = Math.sqrt(Math.pow(Math.abs(mcir.y-cirs[i].y),2) + Math.pow(Math.abs(mcir.x-cirs[i].x),2));
			// -3 for the speed that the circles are moving at
			if(rad < (mcir.r + cirs[i].r)-3 && cirs[i].t==1){
				gameover();
			}
			else if(rad < (mcir.r + cirs[i].r)-3 && cirs[i].t==2){
				
				if(cirs[i].color == "red"){
					//main circle move faster
					respecial();
					if(mvx > 0){
						mvx = 3;
					}
					else{
						mvx = -3;
					}
					isspecial = 1;
				}
				else if(cirs[i].color == "green"){
					//main circle get smaller
					respecial();
					mcir.r -= Math.round(mcirsize/2);
					isspecial = 2;
				}
				else if(cirs[i].color == "blue"){
					// main circle get slower
					respecial();
					if(mvx > 0){
						mvx = 1;
					}
					else{
						mvx = -1;
					}
					isspecial = 3;
				}
				else if(cirs[i].color == "yellow"){
					// main circle get bigger
					respecial();
					mcir.r += Math.round(mcirsize/2);
					isspecial = 4;
				}
				specialtime = setInterval(respecial, 10000);
				
				mcir.color = cirs[i].color;
				// the special circle become normal circle
				cirs[i].t = 3;
				cirs[i].color = "black";
			}
		}
		
		// remove the hidden circles
		if(cirs[0].y > ch+50){
			cirs.shift();
			score +=1;
		}
		
		// push circules if the number of circles is less than 10
		if(cirs.length < 50){
			// (max - min + 1) + min
			var xmin = 0;
			var xmax = cw;
			var randx = Math.round((Math.random() * (xmax - xmin + 1)) + xmin );
			
			// random size
			var rands = (Math.round(cw/200))+(Math.floor((Math.random() * (20 - 5 +1) ) +5 ));
			
			// the y position of the last circle
			var lastciry = Math.round(Math.abs(cirs[cirs.length-1].y));
			var lastcirr = cirs[cirs.length-1].r;
			var randy = ( (Math.round((Math.random() * (10 - 5 + 1)) + 5 )) + lastciry + lastcirr + rands) *-1;
			
			// random color
			var randnc =  Math.floor((Math.random() * colors.length));
			var randc = colors[randnc];
			
			cirs.push(new circle(randx, randy, rands, randc));
		}
		
		// main circle
		mcir.render(ctx);
		mcir.x += mvx;
		
		// bound at the borders
		if(mcir.x + mcir.r >= cw || mcir.x - mcir.r <= 0){
			mvx *= -1;
		}
		
		//tale circles
		talecir.push(new circle(mcir.x, ch-120, Math.round(mcirsize/2), "gray"));
		
		for(var i=0; i<talecir.length; i++){
			talecir[i].render(talectx);
			
			talecir[i].y += 2;
			
			if(talecir[i].y > ch+10){
				talecir.shift();
			}
		}
		
		
		//show score
		showscore.innerHTML = Math.round(score/2);
		
		// animate only if it's not paused and not gameover
		if(p != 1 && gover != 1){
			if(animesup == 1){
				window.requestAnimationFrame(animate);
			}
			else{
				window.setTimeout(animate, 1000 / 60);
			}
		}
	}
	animate();
	
	// remove special effect from the main circle
	function respecial(){
		isspecial = 0;
		mcir.color = "black";
		mcir.r = mcirsize;
		if(mvx > 0){
			mvx = 2;
		}
		else{
			mvx = -2;
		}
		clearInterval(specialtime);
	}
	
	// acceleration function
	function acc(){
		cvy +=1;
		
		if(cvy > 5){
			clearInterval(acctime);
		}
	}
	
	/* main circle get bigger
	function bigger(){
		mcirsize +=3;
		mcir.r = mcirsize;
	}*/
	
	// accelerate after 1 min and main circle get bigger after 10 seconds
	var acctime = setInterval(acc, 60000);
	//var mbig = setInterval(bigger, 60000);
	
	// keyboard control
	document.onkeydown = function(event) {
		var kc = event.keyCode;
		
		if(kc == 39){
			// right
			if(isspecial == 1){
				mvx = 3;
			}
			else if(isspecial == 3){
				mvx = 1;
			}
			else{
				mvx = 2;
			}
		}
		else if(kc == 37){
			// left
			if(isspecial == 1){
				mvx = -3;
			}
			else if(isspecial == 3){
				mvx = -1;
			}
			else{
				mvx = -2;
			}
		}
	}
	
	// touch or click control
	ctx.canvas.addEventListener("click", function(event){
		//var mousex = event.clientX - ctx.canvas.offsetLeft;	// to get the coordinates inside the canvas right if there is a space left in the page
		
		// if it was going left then switch to right and vise versa
		if(mvx <= 0){
			// right
			if(isspecial == 1){
				mvx = 3;
			}
			else if(isspecial == 3){
				mvx = 1;
			}
			else{
				mvx = 2;
			}
		}
		else{
			// right
			if(isspecial == 1){
				mvx = -3;
			}
			else if(isspecial == 3){
				mvx = -1;
			}
			else{
				mvx = -2;
			}
		}
	});
	
	// game over
	function gameover(){
		gover=1;
					
		if(Math.round(score/2) > parseInt(localStorage.hscore) || localStorage.getItem("hscore") == null ){
			localStorage.hscore = Math.round(score/2);
		}
		
		if(musicno != 0){
			m1.pause();
		}
		
		document.getElementById("pausehscore").innerHTML = "High Score: " + localStorage.hscore;
		document.getElementById("pauseyourscore").innerHTML = "Your Score: " + Math.round(score/2);
		document.getElementById("pausebox").style.display = "block";
		document.getElementById("resume").style.display = "none";
	}
	
	// pause
	document.getElementById("pause").addEventListener("click", function(){	// to pause the game
		if(gover != 1){
		p = 1;
		
		clearInterval(acctime);
		//clearInterval(mbig);
		
		if(musicno != 0){
			m1.pause();
		}
		
		document.getElementById("pausehscore").innerHTML = "High Score: " + localStorage.hscore;
		document.getElementById("pauseyourscore").innerHTML = "Your Score: " + Math.round(score/2);
		document.getElementById("pausebox").style.display = "block";
		}
	});
	
	// resume
	document.getElementById("resume").addEventListener("click", function(){
		p = 0;
		
		document.getElementById("pausebox").style.display = "none";
		
		animate();
		acctime = setInterval(acc, 60000);
		//mbig = setInterval(bigger, 1000);
		
		if(musicno != 0){
			m1.play();
		}
		
	});
	
	// restart
	document.getElementById("restart").addEventListener("click", function(){
		location.reload();
	});
	
	
}

window.addEventListener("load", function(event){
	init();
});