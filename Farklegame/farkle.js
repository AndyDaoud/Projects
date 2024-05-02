var diceArr = [];
var p1Score = 0;
var p2Score = 0;
var p3Score = 0;
var p4Score = 0;
var numPlayers = 2;
var pTurn = 1;
var turnScore = 0;		//tracks score of current turn
var rolled = 0;			//variable used to check if player rolled before they can select dice or bank points
var lastTurn = 0;	   	//variable used when win condition is triggered so that each player gets one final turn
var firstTurn = true;  	//used to make sure player can roll without selected die on first turn


function initializeDice(){
	for(i = 0; i < 6; i++){
		diceArr[i] = {};
		diceArr[i].id = "die" + (i + 1);
		diceArr[i].value = i + 1;
		diceArr[i].clicked = 0;
		diceArr[i].aside = 0;
	}
	
	document.getElementById("p1N").style.color = "goldenrod";
	document.getElementById("p1N").style.fontWeight = "900";
	numPlayers = prompt("Choose Number of Players Between 2 and 4");
	while(numPlayers < 2 || numPlayers > 4){
		numPlayers = prompt("Invalid Selection, Choose Between 2 and 4");
	}
	if(numPlayers >= 3){
		document.getElementById("p3N").classList.toggle("invisible");
		document.getElementById("p3").classList.toggle("invisible");

	}
	if(numPlayers >= 4){
		document.getElementById("p4N").classList.toggle("invisible");
		document.getElementById("p4").classList.toggle("invisible");

	}
}


/*Rolling dice values*/
function rollDice(){
	for(var i=0; i < 6; i++){
		if(diceArr[i].clicked === 0 && diceArr[i].aside === 0){
			diceArr[i].value = Math.floor((Math.random() * 6) + 1);
		}
		else{
			diceArr[i].aside = 1;			
		}
	}
	updateDiceImg();
	setTimeout(function(){
		document.getElementById("play").innerHTML = "Select Scoring Dice and Reroll Or Bank Points";},1000);
	rolled = 1;
}


//simple dice roll visualization
function roller(){
	if(checkSelected()){
		firstTurn = false;
		turnScore += countPoints(1);
		for(let i = 0; i < 10; i++){
			setTimeout( () => {rollDice();}, 500 + i*50);
		}
		setTimeout(function(){
			if(countPoints(0) === 0){
				turnScore = 0;
				document.getElementById("play").innerHTML = "Farkle!";
				document.getElementById("play").style.color = "#550A35";
				bankPoints();
			}
		}, 2500);
	}
	else{
		document.getElementById("play").innerHTML = "Invalid Selection, Choose Scoring Dice";
	}
	console.log(diceArr);	
}


/*Updating images of dice given values of rollDice*/
function updateDiceImg(){
	var diceImage;
	for(var i = 0; i < 6; i++){
		diceImage = "images/" + diceArr[i].value + ".png";
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	}
}


function diceClick(img){
	if(rolled === 1){
		var i = img.getAttribute("data-number");
		if(diceArr[i].clicked === 0){
			diceArr[i].clicked = 1;
			img.classList.toggle("transparent");
		}
		else if(diceArr[i].aside === 0){
			diceArr[i].clicked = 0;
			img.classList.toggle("transparent");
		}
	}
}


//check if selected dice can score points and reroll can occur
function checkSelected(){
	var triple = 0;
	var dieSelected = false;
	var legal = true;
	for(var i = 1; i <= 6; i++){
		for(var j = 0; j < 6; j++){
			if(diceArr[j].value === i && diceArr[j].value != 1 && diceArr[j].value != 5 && diceArr[j].clicked === 1){
				triple++;
			}
			if(diceArr[j].aside === 0 && diceArr[j].clicked === 1){
				dieSelected = true;
			}
		}
		if(triple % 3 > 0){
			legal = false;
		}
	}
	if(dieSelected === false && firstTurn === false){
		legal = false;
	}
	return legal;
}

//count points of dice.  If rerolling value is 0, checks all dice that aren't aside, otherwise checks only selected dice
function countPoints(rerolling){
	var triple = 0;
	var tscore = 0;
	var tri1 = 0;
	var tri5 = 0;
	//checking for triples
	for(var i = 1; i <= 6; i++){            
		for(var j = 0; j < 6; j++){
			if(diceArr[j].value === i && diceArr[j].aside === 0 && (diceArr[j].clicked === 1 || diceArr[j].clicked === rerolling)){
				triple++;
			}
		}
		if(triple >= 3){
			if(i === 1){
				if(triple === 6){
					tscore += 2000;
					tri1 = 6;
				}else{
					tscore += 1000;
					tri1 = 3;
				}
			}else if(i === 5){
				if(triple === 6){
					tscore += 1000;
					tri5 = 6;
				}else{
					tscore += 500;
					tri5 = 3;
				}
			}
			else if(triple === 6){
				tscore += (i*200);
			}	
			else{
				tscore += (i*100);
			}
		}
		triple = 0;
		//var sortedArr = diceArr.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
	}
	//scoring 1's and 5's
	for(var k = 0; k < 6; k++){           
		if(diceArr[k].value === 1 && diceArr[k].aside === 0 && (diceArr[k].clicked === 1 || diceArr[k].clicked === rerolling)){
			if(tri1 === 0){
				tscore+=100;
			}else{
				tri1--;
			}
		}else if(diceArr[k].value === 5 && diceArr[k].aside === 0  && (diceArr[k].clicked === 1 || diceArr[k].clicked === rerolling)){
			if(tri5 === 0){
				tscore+=50;
			}else{
				tri5--;
			}
		}
	}
	return tscore;
}

//banks points, checks win condition, and changes player turn
function bankPoints(){
	if(rolled ===1){
		turnScore += countPoints(0);
		//resetting aside and clicked dice 
		for(var m = 0; m < 6; m++){	
			if(diceArr[m].aside === 1 || diceArr[m].clicked === 1){		
				document.images.item(m).classList.toggle("transparent");
				diceArr[m].aside = 0;
				diceArr[m].clicked = 0;
			}
		}
		//set score and change turn
		if(pTurn === 1){
			p1Score += turnScore;
			document.querySelector("#p" + pTurn).innerHTML = p1Score;  
			pTurn = 2;
			document.getElementById("turn").innerHTML = "Turn: Player 2";
			document.getElementById("p2N").style.color = "goldenrod";
			document.getElementById("p1N").style.color = "white";
			document.getElementById("p1N").style.fontWeight = "normal";
			document.getElementById("p2N").style.fontWeight = "900";
		}else if(pTurn ===2){
			p2Score += turnScore;
			document.querySelector("#p" + pTurn).innerHTML = p2Score;  
			if(numPlayers >= 3){
				pTurn = 3;
				document.getElementById("turn").innerHTML = "Turn: Player 3";
			document.getElementById("p3N").style.color = "goldenrod";
			document.getElementById("p2N").style.color = "white";
			document.getElementById("p3N").style.fontWeight = "900";
			document.getElementById("p2N").style.fontWeight = "normal";
			}else{
			pTurn = 1;
			document.getElementById("turn").innerHTML = "Turn: Player 1";
			document.getElementById("p1N").style.color = "goldenrod";
			document.getElementById("p2N").style.color = "white";
			document.getElementById("p1N").style.fontWeight = "900";
			document.getElementById("p2N").style.fontWeight = "normal";
			}
		}else if(pTurn === 3){
			p3Score += turnScore;
	
			document.querySelector("#p" + pTurn).innerHTML = p3Score;  
			if(numPlayers === 4){
				pTurn = 4;
			document.getElementById("turn").innerHTML = "Turn: Player 4";
			document.getElementById("p4N").style.color = "goldenrod";
			document.getElementById("p3N").style.color = "white";
			document.getElementById("p4N").style.fontWeight = "900";
			document.getElementById("p3N").style.fontWeight = "normal";

			
			}else{
			pTurn = 1;
			document.getElementById("turn").innerHTML = "Turn: Player 1";
			document.getElementById("p1N").style.color = "goldenrod";
			document.getElementById("p3N").style.color = "white";
			document.getElementById("p1N").style.fontWeight = "900";
			document.getElementById("p3N").style.fontWeight = "normal";
			}
		}else if(pTurn === 4){
			pTurn = 1;
			document.getElementById("turn").innerHTML = "Turn: Player 1";
			document.getElementById("p1N").style.color = "goldenrod";
			document.getElementById("p4N").style.color = "white";
			document.getElementById("p1N").style.fontWeight = "900";
			document.getElementById("p4N").style.fontWeight = "normal";
		}
		turnScore = 0;
		rolled = 0;
		setTimeout(function(){
			document.getElementById("play").innerHTML = "Roll the Dice";
			document.getElementById("play").style.color = "white"; }, 900);
		firstTurn = true;
		if(lastTurn === 2){
			if(p1Score > p2Score && p1Score > p3Score && p1Score > p4Score){
				document.getElementById("turn").innerHTML = "Player 1 Wins";
				p1Score = 0;
				p2Score = 0;
				p3Score = 0;
				p4Score = 0;
				document.querySelector("#p1").innerHTML = p1Score;  
				document.querySelector("#p2").innerHTML = p2Score;  
				document.querySelector("#p3").innerHTML = p1Score;  
				document.querySelector("#p4").innerHTML = p2Score;  

				lastTurn = 0;
			}else if(p2Score > p1Score && p2Score > p3Score && p2Score > p4Score){
				document.getElementById("turn").innerHTML = "Player 2 Wins";
				p1Score = 0;
				p2Score = 0;
				p3Score = 0;
				p4Score = 0;
				document.querySelector("#p1").innerHTML = p1Score;  
				document.querySelector("#p2").innerHTML = p2Score;  
				document.querySelector("#p3").innerHTML = p1Score;  
				document.querySelector("#p4").innerHTML = p2Score;  
				lastTurn = 0;

			}else if(p3Score > p1Score && p3Score > p2Score && p3Score > p4Score){
				document.getElementById("turn").innerHTML = "Player 3 Wins";
				p1Score = 0;
				p2Score = 0;
				p3Score = 0;
				p4Score = 0;
				document.querySelector("#p1").innerHTML = p1Score;  
				document.querySelector("#p2").innerHTML = p2Score;  
				document.querySelector("#p3").innerHTML = p1Score;  
				document.querySelector("#p4").innerHTML = p2Score;  
				lastTurn = 0;
			
		}else if(p4Score > p1Score && p4Score > p2Score && p4Score > p3Score){
			document.getElementById("turn").innerHTML = "Player 4 Wins";
			p1Score = 0;
			p2Score = 0;
			p3Score = 0;
			p4Score = 0;
			document.querySelector("#p1").innerHTML = p1Score;  
			document.querySelector("#p2").innerHTML = p2Score; 
			document.querySelector("#p3").innerHTML = p1Score;  
				document.querySelector("#p4").innerHTML = p2Score;   
			lastTurn = 0;
		}
				else{
				document.getElementById("turn").innerHTML = "It's a Tie";
				p1Score = 0;
				p2Score = 0;
				p3Score = 0;
				p4Score = 0;
				document.querySelector("#p1").innerHTML = p1Score;  
				document.querySelector("#p2").innerHTML = p2Score; 
				document.querySelector("#p3").innerHTML = p1Score;  
				document.querySelector("#p4").innerHTML = p2Score;   
				lastTurn = 0;
			}
		
		if(p1Score >= 10000 || p2Score >= 10000 || p3Score >= 10000 || p4Score >= 10000){
			lastTurn++;
		}
	}
}}