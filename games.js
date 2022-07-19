const express = require("express");
const https = require('https');

const app = express();

let gamePattern = [];
const buttonColors = ["red", "blue", "yellow", "green"];
let buttonPokemon = ["charmander", "squirtle", "pichu", "bulbasaur"];
let userClickedPattern = [];
let level = 0;


app.use(express.static("public")); // static ensures any files made work from the specified dir
app.use(express.json()); // express took over bodyParser
app.use(express.urlencoded({
  extended: true
})); // extended true uses any urlencoded type not just string

//starts game with restart button click
$(".start").on("click", function() {
  if (gamePattern.length == 0) {
    console.log("begin");
    $("#level-title").html("Let's go!");
    $(".start").addClass("hide");
    $(".container").removeClass("hide");
    setTimeout(function() {
      nextSequence();
    }, 1000);
  }
});

//restarts game with restart button click
$(".restart").on("click", function() {
    console.log("begin");
    resetGame();
    setTimeout(function() {
      nextSequence();
    }, 1000);
});

//user clicks on a button and calls function to check if it is correct or wrong
$(".btn").on("click", function(event) {
  let userClickedColor = event.target.id;
  let userClickedPokemon = event.target.classList[2];
  userClickedPattern.push(userClickedColor);
  checkAnswer(userClickedPattern[userClickedPattern.length - 1], userClickedColor, userClickedPokemon);
});

//check if the recent user input is wrong or correct
function checkAnswer(currentLevel, chosenColor, chosenPokemon) {
  if (currentLevel !== gamePattern[userClickedPattern.length - 1]) {
    playGameOver();
    animateGameOver();
    animatePress(chosenColor);
    $("#level-title").html("Level " + level + "<br/>" + "Game over!");
    $(".container").addClass("hide");
    $(".restart").removeClass("hide");
    console.log("wrong");
  } else if (userClickedPattern.length == gamePattern.length && userClickedPattern[userClickedPattern.length - 1] == gamePattern[gamePattern.length - 1] && countInArray(userClickedPattern, chosenColor) == true) {
    playEvolve();
    animateEvolve(chosenColor, chosenPokemon);
    userClickedPattern = [];
    setTimeout(function() {
      if (checkVictory() == true) {
        playVictory();
        animateVictory();
        animatePress(chosenColor);
        $(".container").addClass("hide");
        $(".restart").removeClass("hide");
        console.log("victory");
      } else {
      nextSequence();
    }
    }, 1500);
  } else if (userClickedPattern.length == gamePattern.length && userClickedPattern[userClickedPattern.length - 1] == gamePattern[gamePattern.length - 1] && countInArray(userClickedPattern, chosenColor) == false) {
    playSound(chosenPokemon);
    animatePress(chosenColor);
    userClickedPattern = [];
    setTimeout(function() {
      nextSequence();
    }, 1000);
  } else {
    playSound(chosenPokemon);
    animatePress(chosenColor);
  }
  console.log("success");
}

function checkVictory() {
if (buttonPokemon.includes("charizard") && buttonPokemon.includes("blastoise") && buttonPokemon.includes("raichu") && buttonPokemon.includes("venusaur")) {
  return true;
} else {
  return false;
}
}

//evolves a pokemon to its next form
function evolvePokemon(pokemon) {
  switch (pokemon) {
    case 'charmander':
      $("#red").switchClass("charmander", "charmeleon", 1000);
      $("#red").css("background-image", "url(public/images/charmeleon.png)");
      buttonPokemon[0] = "charmeleon";
      break;
    case 'charmeleon':
      $("#red").switchClass("charmeleon", "charizard", 1000);
      $("#red").css("background-image", "url(public/images/charizard.png)");
      buttonPokemon[0] = "charizard";
      break;
    case 'squirtle':
      $("#blue").switchClass("squirtle", "wartortle", 1000);
      $("#blue").css("background-image", "url(public/images/wartortle.png)");
      buttonPokemon[1] = "wartortle";
      break;
    case 'wartortle':
      $("#blue").switchClass("wartotle", "blastoise", 1000);
      $("#blue").css("background-image", "url(public/images/blastoise.png)");
      buttonPokemon[1] = "blastoise";
      break;
    case 'pichu':
      $("#yellow").switchClass("pichu", "pikachu", 1000);
      $("#yellow").css("background-image", "url(public/images/pikachu.png)");
      buttonPokemon[2] = "pikachu";
      break;
    case 'pikachu':
      $("#yellow").switchClass("pikachu", "raichu", 1000);
      $("#yellow").css("background-image", "url(public/images/raichu.png)");
      buttonPokemon[2] = "raichu";
      break;
    case 'bulbasaur':
      $("#green").switchClass("bulbasaur", "ivysaur", 1000);
      $("#green").css("background-image", "url(public/images/ivysaur.png)");
      buttonPokemon[3] = "ivysaur";
      break;
    case 'ivysaur':
      $("#green").switchClass("ivysaur", "venusaur", 1000);
      $("#green").css("background-image", "url(public/images/venusaur.png)");
      buttonPokemon[3] = "venusaur";
      break;
    default:
      break;
  }
}

//counts the number of times a pokemon is in an array
function countInArray(gamePatternArray, colorToCount) {
  var count = 0;
  for (var i = 0; i < gamePatternArray.length; i++) {
    if (gamePatternArray[i] === colorToCount) {
      count++;
    }
  }
  if (count == 1) {
    return true;
  } else if (count == 2) {
    return true;
  } else {
    return false;
  }
}

//function for randomly choosing the next color of the sequence and playing the color sound and adds to gamePattern
function nextSequence() {
  //animateGameSequence()
  let randomNumber = Math.floor((Math.random() * 4));
  let randomChosenColor = buttonColors[randomNumber];
  let randomChosenPokemon = buttonPokemon[randomNumber];;
  playSound(randomChosenPokemon);
  animatePress(randomChosenColor);
  level = level + 1;
  $("#level-title").html("Level " + level);
  gamePattern.push(randomChosenColor);
}

/*does not work - play sequence at beginning of level
function animateGameSequence() {
  for (let i = 0; i <= gamePattern.length; i++) {
    setTimeout(function(){
      playSound(buttonPokemon[buttonColors.indexOf(gamePattern[i])]);
      animatePress(gamePattern[i]);
    }, 500);
  }
}*/

//resets the game parameters
function resetGame() {
  $("#level-title").html("Let's go!");
  $('body').removeClass("game-over");
  $('body').removeClass("victory");
  $(".restart").addClass("hide");
  $(".container").removeClass("hide");
  $(".image").addClass("hide");
  gamePattern = [];
  buttonPokemon = ["charmander", "squirtle", "pikachu", "bulbasaur"];
  userClickedPattern = [];
  level = 0;
  $("#red").css("background-image", "url(public/images/charmander.png)");
  $("#blue").css("background-image", "url(public/images/squirtle.png)");
  $("#yellow").css("background-image", "url(public/images/pichu.png)");
  $("#green").css("background-image", "url(public/images/bulbasaur.png)");
  $("#red").removeClass("charizard charmeleon charmander").addClass("charmander");
  $("#blue").removeClass("blastoise wartortle squirtle").addClass("squirtle");
  $("#yellow").removeClass("raichu pikachu pichu").addClass("pichu");
  $("#green").removeClass("venusaur ivysaur bulbasaur").addClass("bulbasaur");
}

//function for playing sounds of each color
function playSound(name) {
  let audioColor = new Audio("sounds/" + name + ".mp3");
  audioColor.play();
}

//function of animating color selection
function animatePress(currentColor) {
  $('#' + currentColor).addClass("pressed");
  setTimeout(function() {
    $('#' + currentColor).removeClass("pressed");
  }, 200);
}

//function for playing sound when user makes mistake
function playGameOver() {
  let audioColor = new Audio("sounds/confused.mp3");
  audioColor.play();
}

//function of animating color when user makes mistake
function animateGameOver() {
  $('body').addClass("game-over");
  $("#img-go").removeClass("hide");
}

function playEvolve() {
  let audioColor = new Audio("sounds/transform.mp3");
  audioColor.play();
}

function animateEvolve(currentColor, currentPokemon) {
  $('#' + currentColor).addClass("evolve");
  setTimeout(function() {
    evolvePokemon(currentPokemon);
    $('#' + currentColor).removeClass("evolve");
      }, 1000);
}

//function for playing sound when user makes mistake
function playVictory() {
  let audioColor = new Audio("sounds/victory.mp3");
  audioColor.play();
}

//function of animating color when user makes mistake
function animateVictory() {
  $('body').addClass("victory");
  $("#level-title").html("Level " + level + "<br/>" + "You caught them all!");
  $("#img-vic").removeClass("hide");
}
