$(document).ready(() => {

    let dice = [
        "AACIOT",
        "ABILTY",
        "ABJMOQ",
        "ACDEMP",
        "ACELRS",
        "ADENVZ",
        "AHMORS",
        "BIFORX",
        "DENOSW",
        "DKNOTU",
        "EEFHIY",
        "EGKLUY",
        "EGINTV",
        "EHINPS",
        "ELPSTU",
        "GILRUW"
    ]

    let hasBeenClicked = [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
    ];

    let anySelections = false;
    let lastClicked = "";
    let wordList = [];
    let gameScore = 0;
    let gameTime = 180;
    let begin;

    updateScore(this.gameScore);
    loadTime(this.gameTime);

    $("#reset-button").click(() => {
        clearInterval(begin);
        begin = setInterval(() => { countDown() }, 1000);
        this.gameTime = 180;
        loadTime(this.gameTime);
        resetDataAndOutput();
        clearList();
        loadLettersToTable();
    });

    $("#cancel-button").click(() => {
        resetDataAndOutput();
    });

    $("#ok-button").click(() => {

        let word = $("#boggle-word-builder").text().toLowerCase();

        if (word.length == 0) {
            alert("The word must contain atleast one letter");
            resetDataAndOutput();
        }
        else {
            if (wordList.length > 0 && wordList.find(w => w == word)) {
                alert("That word is already in the list");
                resetDataAndOutput();
            }
            else /* good to go */ {

                wordList.push(word);
                this.gameScore += scoreWord(word);
                updateScore(this.gameScore);
                $("#boggle-list-builder").append("<li>" + word + "</li>");
                resetDataAndOutput();
            }
        }
    });

    function scoreWord(word) {
        let score;
        let l = word.length;

        if (l < 3) score = 0;
        if (l == 3) score = 1;
        if (l == 4) score = 1;
        if (l == 5) score = 2;
        if (l == 6) score = 3;
        if (l == 7) score = 5;
        if (l == 8) score = 11;
        if (l == 9) score = 13;
        if (l == 10) score = 15;
        if (l == 11) score = 17;
        if (l == 12) score = 19;
        if (l == 13) score = 21;
        if (l == 14) score = 23;
        if (l == 15) score = 25;
        if (l == 16) score = 27;

        return score;
    }

    //Arrow function does not work for (this)
    $(".table-die").click(function () {

        if (!anySelections) {
            dieClicked(this)
            anySelections = true;
        }
        else {
            if (diePreviouslyClicked(this)) {
                alert("Cannot choose the same die twice");
            }
            else if (!adjacentDieClicked(this)) {
                alert("The next die must connect to the corner or side of the last die chosen");
            }
            else {
                dieClicked(this);
            }
        }
    });

    function dieClicked(die) {
        hasBeenClicked[parseInt($(die).attr("id").charAt(0))][parseInt($(die).attr("id").charAt(1))] = true;
        lastClicked = $(die).attr("id");
        $(die).css("background-color", "#308245");
        $("#boggle-word-builder").append($(die).text());
    }

    function diePreviouslyClicked(die) {
        return hasBeenClicked[parseInt($(die).attr("id").charAt(0))][parseInt($(die).attr("id").charAt(1))];
    }

    function adjacentDieClicked(die) {
        let coordRow = parseInt($(die).attr("id").charAt(0));
        let coordCol = parseInt($(die).attr("id").charAt(1));

        let topLeft = "" + (coordRow - 1) + (coordCol - 1);
        let topCenter = "" + (coordRow - 1) + (coordCol);
        let topRight = "" + (coordRow - 1) + (coordCol + 1);
        let left = "" + (coordRow) + (coordCol - 1);
        let right = "" + (coordRow) + (coordCol + 1);
        let botLeft = "" + (coordRow + 1) + (coordCol - 1);
        let botCenter = "" + (coordRow + 1) + (coordCol);
        let botRight = "" + (coordRow + 1) + (coordCol + 1);
        let adjacentCoords = [topLeft, topCenter, topRight, left, right, botLeft, botCenter, botRight];

        return (lastClicked == adjacentCoords.find(a => a == lastClicked));
    }

    function loadTime(gameTime) {
        $("#timer").text(gameTime);
    }

    function countDown() {
        gameTime--;
        loadTime(gameTime);
        if (gameTime == 0) {
            alert("Times up! Your score is: " + gameScore + ". Press 'New Game' to play again.");
            gameOver();
        }
    }

    function resetDataAndOutput() {
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                hasBeenClicked[i][j] = false;
                $("#" + i + j).css("background-color", "#8F9178");
            }
        }
        anySelections = false;
        lastClicked = "";
        $("#boggle-word-builder").text("");
    }

    function clearList() {
        $("#boggle-list-builder").text("");
        wordList = [];
        this.gameScore = 0;
        updateScore(this.gameScore);
    }

    function updateScore(s) {
        $("#score").text(s);
    }

    function loadLettersToTable() {
        anySelections = false;

        let shuffledArray = getShuffledArray(dice);
        let diceIndex = 0;
        let newLetter;

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {

                // With every new die, obtain a random letter
                newLetter = shuffledArray[diceIndex].charAt(Math.floor(Math.random() * 6));
                if (newLetter == "Q") newLetter += "U";
                $("#" + i + j).text(newLetter);
                diceIndex++;
            }
        }
    }

    function getShuffledArray(array = dice) {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 != currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array
    }

    function gameOver() {
        clearInterval(begin);
        clearBoard();
    }

    function clearBoard() {
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                $("#" + i + j).text("");
            }
        }
    }
});