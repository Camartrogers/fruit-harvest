"use strict";

//Game Object
const fruitHarvest = {
  ////////////
  //Properties//
  ////////////
  isRunning: false,
  counter: 0,
  startingTime: 30000,
  difficulty: 1000,
  gravityFactor: 1,
  intervalTimer: null,
  intervalBanana: null,
  intervalPineapple: null,
  intervalGravity: null,
  score: 0,
  randomXValue: 0,
  lives: 3,
  timer: $("#time-display"),
  fruit: [],
  ////////////
  //FUNCTIONS//
  ////////////
  addPlayer: function (playerName = "") {
    playerName = document.querySelector("#player-name");
    if (playerName.value.length > 0) {
      let newPlayer = document.createElement("div");
      newPlayer.innerHTML = `Current Player: <span id="player"> ${playerName.value}</span>`;
      $("#header").append(newPlayer);
      $("#header div").addClass("player");
    } else {
      alert("Please type your name in the input field");
    }
  },
  //format time on the game screen
  formatTime: function (ms = 0) {
    let sec = ms % 60;
    if (sec > 10) {
      return sec.toFixed(1);
    } else if (sec < 10) {
      return "0" + sec.toFixed(1);
    }
  },
  // function to update length and color of the progress bar
  updateProgress: function () {
    $(".progress-bar").css(
      "width",
      ((fruitHarvest.currentTime * 1000) / fruitHarvest.startingTime) * 100 +
        "%"
    );
    $(".progress-bar").attr(
      "aria-valuenow",
      ((fruitHarvest.currentTime * 1000) / fruitHarvest.startingTime) * 100
    );
    if (
      ((fruitHarvest.currentTime * 1000) / fruitHarvest.startingTime) * 100 >=
      50
    ) {
      $(".progress-bar").addClass("bg-success");
      $(".progress-bar").removeClass("bg-warning bg-danger");
    }
    if (
      ((fruitHarvest.currentTime * 1000) / fruitHarvest.startingTime) * 100 <
      50
    ) {
      $(".progress-bar").addClass("bg-warning");
      $(".progress-bar").removeClass("bg-success bg-danger");
    }
    if (
      ((fruitHarvest.currentTime * 1000) / fruitHarvest.startingTime) * 100 <
      25
    ) {
      $(".progress-bar").addClass("bg-danger");
      $(".progress-bar").removeClass("bg-success bg-warning");
    }
  },
  //timer function
  timeIt: function () {
    fruitHarvest.counter++;
    fruitHarvest.currentTime =
      (fruitHarvest.startingTime - 100 * fruitHarvest.counter) / 1000;
    fruitHarvest.timer.text(fruitHarvest.formatTime(fruitHarvest.currentTime));
    fruitHarvest.updateProgress();
    if (fruitHarvest.currentTime === 0) {
      clearInterval(fruitHarvest.intervalTimer);
      clearInterval(fruitHarvest.intervalBanana);
      clearInterval(fruitHarvest.intervalPineapple);
      clearInterval(fruitHarvest.intervalGravity);
      fruitHarvest.counter = 0;
      fruitHarvest.isRunning = false;
      $("#game-screen").hide();
      $("#game-over-scrn").show();
    }
  },
  // Create random X-axis value for generated bananas & pineapples, to be called to update .css('left', randomX()) 436 is the width of the gameboard in px minus the width of the banana img
  randomX: function () {
    fruitHarvest.randomXValue = Math.random() * 436;
  },
  // add bananas to the screen on interval and log in banana array to be looped through by gravity
  addBanana: function () {
    const newBananaObj = new Banana();
    // newBananaObj.createBanana();
    fruitHarvest.fruit.push(newBananaObj);
  },
  //add pineapples to the screen on interval and log them in the pineapple array to be looped through by gravity
  addPineapple: function () {
    const newPineappleObj = new Pineapple();
    fruitHarvest.fruit.push(newPineappleObj);
  },
  //Add one to score and update game screen and game-over screen
  updateScore: function () {
    fruitHarvest.score++;
    $("#score").text(fruitHarvest.score);
    $("#final-score").text(fruitHarvest.score);
  },
  // take away a life when pineapple is clicked
  loseLife: function () {
    fruitHarvest.lives--;
    if (fruitHarvest.lives === 2) {
      $("#heart1").hide();
    } else if (fruitHarvest.lives === 1) {
      $("#heart2").hide();
    } else {
      clearInterval(fruitHarvest.intervalID);
      clearInterval(fruitHarvest.intervalBanana);
      clearInterval(fruitHarvest.intervalPineapple);
      clearInterval(fruitHarvest.intervalGravity);
      fruitHarvest.counter = 0;
      fruitHarvest.isRunning = false;
      $("#game-screen").hide();
      $("#game-over-scrn").show();
    }
  },
  // called on interval to increase the fruit distance from the top of screen
  gravity(fruit) {
    let fruitY = $(fruit.dom).position().top;
    if (fruitY > 500) {
      fruit.dom.remove();
    }
    $(fruit.dom).css("top", `${fruitY + fruitHarvest.gravityFactor}px`);
  },
  //Function initiated when the start button is pressed -starts the timer, starts bananas/pineapples falling
  startGame: function () {
    window.clearInterval(fruitHarvest.intervalTimer);
    fruitHarvest.intervalTimer = window.setInterval(fruitHarvest.timeIt, 100);
    fruitHarvest.isRunning = true;
    fruitHarvest.resetGame();
    fruitHarvest.lives = 3;
    $("#heart1").show();
    $("#heart2").show();
    $("#splash-screen").hide();
    $("#game-over-scrn").hide();
    $("#game-screen").show();
    //Interval for Bananas
    window.clearInterval(fruitHarvest.intervalBanana);
    fruitHarvest.intervalBanana = window.setInterval(
      fruitHarvest.addBanana,
      fruitHarvest.difficulty
    );
    //Interval for Pineapples
    window.clearInterval(fruitHarvest.intervalPineapple);
    fruitHarvest.intervalPineapple = window.setInterval(
      fruitHarvest.addPineapple,
      fruitHarvest.difficulty * 2
    );
    // Gravity Interval
    window.clearInterval(fruitHarvest.intervalGravity);
    fruitHarvest.intervalGravity = window.setInterval(function () {
      for (let fruits of fruitHarvest.fruit) {
        fruitHarvest.gravity(fruits);
      }
    }, 10);
  },
  resetGame: function () {
    for (let fruits of fruitHarvest.fruit) {
      fruits.dom.remove();
    }
    while (fruitHarvest.fruit.length) {
      fruitHarvest.fruit.pop();
    }
    fruitHarvest.score = -1;
    fruitHarvest.updateScore();
  },
};

////////////
//Classes//
////////////

//banana class
class Banana {
  constructor() {
    let newBanana = document.createElement("div");
    newBanana.innerHTML =
      "<img src='./media/banana.png' alt='banana' class='banana'/>";
    $("#game-screen").append(newBanana);
    newBanana.classList.add("banana");
    fruitHarvest.randomX();
    newBanana.style.left = fruitHarvest.randomXValue + "px";
    //add event listener
    newBanana.addEventListener("click", function () {
      fruitHarvest.updateScore();
      this.remove();
    });
    this.dom = newBanana;
  }
}

//pineapple class
class Pineapple {
  constructor() {
    let newPineapple = document.createElement("div");
    newPineapple.innerHTML =
      '<img src="./media/pineapple.png" alt="pineapple" class="pineapple"/>';
    $("#game-screen").append(newPineapple);
    newPineapple.classList.add("pineapple");
    fruitHarvest.randomX();
    newPineapple.style.left = fruitHarvest.randomXValue + "px";
    //add event listener
    newPineapple.addEventListener("click", function () {
      fruitHarvest.loseLife();
      this.remove();
    });
    this.dom = newPineapple;
  }
}

// EVENT LISTENERS
// Join button - Splash screen
$("#add-player-button").on("click", function () {
  fruitHarvest.addPlayer();
});

//Easy button - Splash screen
$("#easy-btn").on("click", function () {
  fruitHarvest.difficulty = 750;
  fruitHarvest.gravityFactor = 1;
});
//Mediun button - Splash screen
$("#med-btn").on("click", function () {
  fruitHarvest.difficulty = 500;
  fruitHarvest.gravityFactor = 3;
});
//Hard button - Splash screen
$("#hard-btn").on("click", function () {
  fruitHarvest.difficulty = 300;
  fruitHarvest.gravityFactor = 5;
});

//Start button - Splash screen
$("#start-btn").on("click", function () {
  fruitHarvest.startGame();
});

//Replay button - Game Over screen
$("#replay-btn").on("click", function () {
  fruitHarvest.startGame();
});
// Quit button - Game over screen
$("#quit-btn").on("click", function () {
  $("#game-over-scrn").hide();
  $("#splash-screen").show();
  $("#header div").remove();
});
