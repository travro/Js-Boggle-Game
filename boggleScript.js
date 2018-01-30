var die00 = "AACIOT";
var die01 = "ABILTY";
var die02 = "ABJMOQ";
var die03 = "ACDEMP";
var die04 = "ACELRS";
var die05 = "ADENVZ";
var die06 = "AHMORS";
var die07 = "BIFORX";
var die08 = "DENOSW";
var die09 = "DKNOTU";
var die10 = "EEFHIY";
var die11 = "EGKLUY";
var die12 = "EGINTV";
var die13 = "EHINPS";
var die14 = "ELPSTU";
var die15 = "GILRUW";

var diceArray = [ die00, die01, die02, die03, die04, die05, die06, die07, die08, die09, die10, die11, die12, die13, die14, die15];

var hasBeenClicked = [ 
	[false, false, false, false],
	[false, false, false, false],
	[false, false, false, false],
	[false, false, false, false] 
];
var noSelectionsClicked = true;
var lastClicked = "";
var wordList = new Array();
var wordListIndex = 0;
var gameScore = 0;
var gameTime = 180;
var begin;

window.onload = function()
{
	updateScore();
	loadTime();
}

function loadLettersToTable()
{	
	noSelectionsClicked = true;

	var shuffledArray = shuffleArray(diceArray);
	var diceIndex = 0;	
	var newLetter;

	for(i = 0; i < 4; i++)
    {
        for(j = 0; j< 4; j++)
        {            
			//needs a way to shuffle dice
			newLetter = shuffledArray[diceIndex].charAt(Math.floor(Math.random() * 6));			
			if(newLetter == "Q") newLetter += "U";			
			document.getElementById("" + i + j).innerHTML = newLetter;
			diceIndex++;
        }
	} 
}

//fills the new dice array with the elements of the original array at random indices
function shuffleArray(array)
{
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
	
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	  }
	  
	  return array;
}

//
function cellClick(id)
{
	if(noSelectionsClicked)
	{
		cellWasClicked(id);
		noSelectionsClicked = false;
	}
	else
	{
		if(cellAlreadyClicked(id))
		{
			alert("This letter cannot be chosen twice");
		}
		else if(!adjacentCellWasClicked(id))
		{
			alert("The next letter must connect to the corner or side of the last one you chose");
		}
		else
		{
			cellWasClicked(id);
		} 
	}	
}

function cellWasClicked(id)
{
	hasBeenClicked[parseInt(id.charAt(0))][parseInt(id.charAt(1))] = true;
	lastClicked = id;
	document.getElementById(id).style="background-color:#308245;";
	document.getElementById("boggleWordBuilder").innerHTML += document.getElementById(id).innerHTML;
}

function cellAlreadyClicked(id)
{
	return hasBeenClicked[parseInt(id.charAt(0))][parseInt(id.charAt(1))];
}

function adjacentCellWasClicked(id)
{
	var coordRow = parseInt(id.charAt(0));
	var coordCol = parseInt(id.charAt(1));

	var topLeft = "" + (coordRow - 1)  + (coordCol - 1);
	var topCenter = "" + (coordRow - 1)  + (coordCol);
	var topRight = "" + (coordRow - 1)  + (coordCol + 1);
	var left = "" + (coordRow)  + (coordCol - 1);
	var right = "" + (coordRow)  + (coordCol + 1);
	var botLeft = "" + (coordRow + 1)  + (coordCol - 1);
	var botCenter = "" + (coordRow + 1)  + (coordCol); 
	var botRight = "" + (coordRow + 1)  + (coordCol + 1);

	var adjacentCoord = [topLeft, topCenter, topRight, left, right, botLeft, botCenter, botRight];

	for(i = 0; i < 8; i++)
	{		
		if(lastClicked == adjacentCoord[i]) return true;
	}
	return false;
}

//handler for ok button
function okWord()
{
	var word = document.getElementById("boggleWordBuilder").innerHTML.toString().toLowerCase();

	if(word.length == 0)
	{
		alert("The word must contain atleast one letter");
		cancelWord();
	}
	else{
		if(wordInList(word))		
		{
			alert("That word is already in the list");
			cancelWord();
		}
		else /* good to go */
		{
			
			wordList.push(word);
			scoreWord(word);
			updateScore();
			document.getElementById("boggleListBuilder").innerHTML += ("<li>" + word + "</ul>");
			resetDataAndOutput();
		}	
	}	
}

//handler for cancel button
function cancelWord()
{		
	resetDataAndOutput();
}

//handler for new game button
function newGame()
{	 	
	clearInterval(begin);
	begin = setInterval(function(){countDown()}, 1000);
	gameTime = 180;
	loadTime();
	resetDataAndOutput();
	clearList();
	loadLettersToTable();	
}

function resetDataAndOutput()
{
	for(i = 0; i < 4; i++)
    {
        for(j = 0; j< 4; j++)
        {            
			hasBeenClicked[i][j] = false;
			document.getElementById("" + i + j).style= "background-color:#c8cca0;"
        }
	}
	noSelectionsClicked = true;
	lastClicked = "";
	document.getElementById("boggleWordBuilder").innerHTML = "";
}

function clearList()
{
	document.getElementById("boggleListBuilder").innerHTML = "";
	wordList = [];
	gameScore = 0;
	updateScore();
}

//checks to see if the word has already been played
function wordInList(word)
{
	for(i = 0; i < wordList.length; i++)
	{
		if(word== wordList[i]) return true;
	}
	return false;
}

//words are scored based on length; with an added point if a 'q' was used
function scoreWord(word)
{
	var score;
	var l = word.length;
	
	if(l < 3) score = 0;
	if (l == 3) score = 1;
	if(l == 4) score = 1;
	if(l == 5) score = 2;
	if(l == 6) score = 3;
	if(l == 7) score = 5;
	if(l == 8) score = 11;
	if(l == 9) score = 13;
	if(l == 10) score = 15;
	if(l == 11) score = 17;
	if(l == 12) score = 19;
	if(l == 13) score = 21;
	if(l == 14) score = 23;
	if(l == 15) score = 25;
	if (l == 16) score = 27;
	
	gameScore += score;
}

function updateScore()
{
	document.getElementById("score").innerHTML = gameScore;
}

function loadTime()
{
	document.getElementById("timer").innerHTML = gameTime;
}

function countDown()
{
	gameTime--; 
	loadTime();
	if(gameTime == 0){
		alert("Times up! Your score is: " + gameScore + ". Press 'New Game' to play again.");
		gameOver();
	} 
}

//called when timer reaches zero
function gameOver()
{
	clearInterval(begin);
	clearBoard();
}

//clears the board at gameOver so no more words can be made; can still be played though;
function clearBoard()
{
	for(i = 0; i < 4; i++)
    {
        for(j = 0; j< 4; j++)
        {            
            document.getElementById("" + i + j).innerHTML = "";
        }
    }
}