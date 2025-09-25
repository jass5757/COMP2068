const prompt = require('prompt');

console.log("Rock-Paper-Scissors!");

prompt.start();

prompt.get(['userSelection'], function(err, result) {
    if (err) { return console.error(err); }
    let userSelection = result.userSelection.toUpperCase();

    // Computer choice using Math.random
    let randomNum = Math.random();
    let computerSelection;

    if (randomNum <= 0.34) {
        computerSelection = 'PAPER';
    } else if (randomNum <= 0.67) {
        computerSelection = 'SCISSORS';
    } else {
        computerSelection = 'ROCK';
    }

    console.log(`User Selection: ${userSelection}`);
    console.log(`Computer Selection: ${computerSelection}`);

    // Decision logic
    if (userSelection === computerSelection) {
        console.log("It's a tie");
    } 
    else if (
      (userSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
      (userSelection === 'PAPER' && computerSelection === 'ROCK') ||
      (userSelection === 'SCISSORS' && computerSelection === 'PAPER')
    ) {
        console.log("User Wins");
    } 
    else if (
      (userSelection === 'ROCK' && computerSelection === 'PAPER') ||
      (userSelection === 'PAPER' && computerSelection === 'SCISSORS') ||
      (userSelection === 'SCISSORS' && computerSelection === 'ROCK')
    ) {
        console.log("Computer Wins");
    }
    else {
        console.log("Invalid input. Please choose ROCK, PAPER, or SCISSORS.");
    }
});