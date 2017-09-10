// require packages
var BasicFlashcard = require("./BasicCard.js");
var ClozeFlashcard = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");
var colors = require("colors");

//starting prompt
inquirer.prompt([{
  name: "reviewOrCreate",
  message: "Welcome to Rick and Morty flashcards. You can answer the existing questions ".red + "(IN ALL LOWER CASE)".red.bgWhite + " or make new ones. Would you like to make a new flash card or review existing ones?".red,
  type: "list",
  choices: [{
    name: "Add A Card!"
  }, {
    name: "Review Existing Cards!"
  }]
}]).then(function(choice) {
  if (choice.reviewOrCreate === "Add A Card!") {
    console.log("card add");
    addCard();
  } else if (choice.reviewOrCreate === "Review Existing Cards!") {
    reviewCards();
  }
});
//choose add card
var addCard = function() {
  //input choice
  inquirer.prompt([{
    name: "basicOrCloze",
    message: "What kind of flashcard would you like to make?",
    type: "list",
    choices: [{
      name: "Basic Flashcard - Question and Answer"
    }, {
      name: "Cloze Flashcard - Fill in the blank"
    }]
    //input received
  }]).then(function(choice) {
    //input basic
    if (choice.basicOrCloze === "Basic Flashcard - Question and Answer") {
      inquirer.prompt([{
        name: "front",
        message: "Type in your question",
        validate: function(response) {
          if (response === "") {
            console.log("Please provide a valid response...");
            return false;
          } else {
            return true;
          }
        }
      }, {
        name: "back",
        message: "What is the answer?",
        validate: function(response) {
          if (response === "") {
            console.log("Please provide a valid response...");
            return false;
          } else {
            return true;
          }
        }
        //create basic card
      }]).then(function(choice) {
        var makeBasic = new BasicFlashcard(choice.front, choice.back);
        makeBasic.create();
        whatsNext();
      });
      //input cloze
    } else if (choice.basicOrCloze === "Cloze Flashcard - Fill in the blank") {
      inquirer.prompt([{
        name: "fullText",
        message: "What is the full sentence with the missing parts filled in?",
        validate: function(response) {
          if (response === "") {
            console.log("Please enter a valid response...");
            return false;
          } else {
            return true;
          }
        }
      }, {
        name: "blank",
        message: "What is the part of the text you would like to remove?",
        validate: function(response) {
          if (response === "") {
            console.log("Please provide a valide response (It must match the text exactly)...");
            return false;
          } else {
            return true;
          }
        }
        //make cloze card
      }]).then(function(choice) {
        var fullText = choice.fullText;
        var blank = choice.blank;
        if (fullText.includes(blank)) {
          var makeCloze = new ClozeFlashcard(fullText, blank);
          makeCloze.create();
          whatsNext();
        } else {
          console.log("The 'blank' portion  does not match the text. Try again.");
          addCard();
        }
      });
    }
  });
};

var whatsNext = function() {
  //input
  inquirer.prompt([{
    name: "nextAction",
    message: "Now what?",
    type: "list",
    choices: [{
      name: "Create Another Flashcard!"
    }, {
      name: "Review Existing Cards!"
    }, {
      name: "I don't know..."
    }]
    //input received
  }]).then(function(choice) {
    if (choice.nextAction === "Create Another Flashcard!") {
      addCard();
    } else if (choice.nextAction === "Review Existing Cards!") {
      reviewCards();
    } else if (choice.nextAction === "I don't know...") {
      return;
    }
  });
};

var reviewCards = function() {
  //read log file
  fs.readFile("./log.txt", "utf8", function(error, data) {
    //error
    if (error) {
      console.log("Error : " + error);
    }
    var madeCards = data.split(";");
    var alpha = function(beta) {
      return beta;
    };
    madeCards = madeCards.filter(alpha);
    var count = 0;
    displayCards(madeCards, count);
  });
};

var displayCards = function(array, index) {
  madeCards = array[index];
  var parsedmadeCards = JSON.parse(madeCards);
  var cardsText;
  var correct;
  if (parsedmadeCards.type === "basic") {
    cardsText = parsedmadeCards.front.underline;
    correct = parsedmadeCards.back.red.bold;
  } else if (parsedmadeCards.type === "cloze") {
    cardsText = parsedmadeCards.clozeDeleted.underline;
    correct = parsedmadeCards.cloze.red.bold;
  }
  inquirer.prompt([{
    name: "response",
    message: ("The question is... " + cardsText)
  }]).then(function(answer) {
    if (answer.response === correct) {
      console.log("You answered correctly. The answer is " + correct);
      if (index < array.length - 1) {
        displayCards(array, index + 1);
      }
    } else {
      console.log("Your answer is not correct! The correct answer is " + correct);
      if (index < array.length - 1) {
        displayCards(array, index + 1);
      }
    }
  });
};
