var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

// Check if a game is started or not
$(document).keydown(function () {
    if (!started) {
        nextSequence();
        started = true;
    }
});

// Function tracks the user actions
$(".btn").click(function () {
    var userChosenColor = $(this).attr('id');
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
});

// The game creates a next move
function nextSequence () {
    userClickedPattern = [];

    var randomNumber = Math.floor(Math.random() * 4);

    // Randomly create a color
    var randomChosenColor = buttonColors[randomNumber];

    // Put an initial color into the game pattern
    gamePattern.push(randomChosenColor);

    // Little effect
    $("#" + randomChosenColor).fadeOut(100).fadeIn(100);

    $("#level-title").text("Level " + level);
    playSound(randomChosenColor);
    level += 1;
}

function playSound (name) {
    var audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

function animatePress (currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function startOver () {
    level = 0;
    gamePattern = [];
    started = false;
}

function checkAnswer (currentLevel) {
    if (gamePattern[currentLevel] !== userClickedPattern[currentLevel]) {
        $("#level-title").text("Game Over, Press Any Key to Restart");

        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);

        startOver();
        return;
    }

    if (gamePattern.length === userClickedPattern.length) {
        setTimeout(function () { nextSequence(); }, 1000);
        return;
    }
}