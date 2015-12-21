window.addEventListener("load", function(event){
	optstart();
});

var sound = 1;

function optstart(){
	if(localStorage.sound == "1" || localStorage.getItem("sound") == null ){
		document.getElementById("soundcon").innerHTML = "Turn Sound off";
		sound = 1;
	}
	else{
		document.getElementById("soundcon").innerHTML = "Turn Sound on";
		sound = 0;
	}
	
	// sound control
	document.getElementById("soundcon").addEventListener("click", function(){
		if(sound == 1){
			sound = 0;
			localStorage.sound = "0";
			document.getElementById("soundcon").innerHTML = "Turn Sound on";
		}
		else{
			sound = 1;
			localStorage.sound = "1";
			document.getElementById("soundcon").innerHTML = "Turn Sound off";
		}
	});
}