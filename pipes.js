//brenden haskins
//pipes visual rework
//constants to represent the canvas element to place SVG onto
var target = document.getElementById('target');
//dimensions of the canvas element
var height = window.innerHeight;
var width = window.innerWidth;
//TODO: remember what this is
var padding = 100;
//total amount of lines to draw
var lineCount = 10;
//width of a line
var choosenWidth = 6;
//length of drawing animations in ms
var animationTime = 1000;
//variables for adjusting the apperance of a line
var chosenColor = 'dodgerblue';
var colorCount = 0;
var colors = ['blue', 'cyan', 'dodgerblue', 'lightblue'];
//variable for tracking where the current line is
var currentPipePos = [0, 0];
//how long to wait before starting the animation
var waitTime = 0;
//how many times a line has began (started from the edge of the canvas)
var totalSpinups = 0;
//boolean switch to determine if a drawing process is the first in a line's lifespan
var spinUp = true;
var canvas = SVG()
    .addTo('body')
    .size(width, height);
//NOTES: 
/**
 * How can i get rid of the small padding around the SVG? the sbg is an html element after all.
 * Sometimes pipes draw in the same direction twice?
 * Pipes should change color to show depth
 * Very small corners showing on pipes
 * refactor ugly code
 * add seed to make animations consistent?
 */
//BASIC CONCEPT:
/**
 * firstly decide where on the edge of canvas to start
 * draw a 'line' that is a vector of the starting point
 * get a new coordinate to draw too
 * call pipeObject.animate()
 */
window.addEventListener('DOMContentLoaded', function (e) {
    while (totalSpinups < lineCount) {
        drawNewRandomPipe(Math.random() >= 0.5, Math.random() >= 0.5, Math.random() * 10);
    }
    console.log('loaded');
});
function drawNewRandomPipe(isMovingVertically, isMovingNorthWest, count) {
    if (spinUp) {
        if (count < 1) {
            return;
        }
        isMovingVertically ? currentPipePos = [getRandomInt(50, width - 50), 0] : currentPipePos = [0, getRandomInt(padding, height - padding)];
        colorCount++;
        chosenColor = colors[colorCount % 4];
        totalSpinups++;
        spinUp = false;
    }
    //determine movement up/left OR down/right
    var coefficientChange;
    isMovingNorthWest == true ? coefficientChange = 1 : coefficientChange = -1;
    if (isMovingVertically) {
        //take the x coord of current position, change the y coord
        var initialPipe = canvas.line(currentPipePos[0], currentPipePos[1], currentPipePos[0], currentPipePos[1]).stroke({ color: chosenColor, width: 6 });
        ;
        var newYcoord = currentPipePos[1] + getRandomInt((50 * coefficientChange), (400 * coefficientChange));
        if (newYcoord > height) {
            spinUp = true;
            newYcoord = height;
            totalSpinups++;
        }
        if (newYcoord < 0) {
            spinUp = true;
            newYcoord = 0;
            totalSpinups++;
        }
        initialPipe.animate(animationTime, waitTime).plot(currentPipePos[0], currentPipePos[1], currentPipePos[0], newYcoord);
        currentPipePos[1] = newYcoord;
    }
    else {
        //take the y coord of the current position, change the x coord
        var initialPipe = canvas.line(currentPipePos[0], currentPipePos[1], currentPipePos[0], currentPipePos[1]).stroke({ color: chosenColor, width: 6 });
        ;
        var newXcoord = currentPipePos[0] + getRandomInt((50 * coefficientChange), (400 * coefficientChange));
        if (newXcoord > width) {
            spinUp = true;
            newXcoord = width;
            totalSpinups++;
        }
        if (newXcoord < 0) {
            spinUp = true;
            newXcoord = 0;
            totalSpinups++;
        }
        ;
        initialPipe.animate(animationTime, waitTime).plot(currentPipePos[0], currentPipePos[1], newXcoord, currentPipePos[1]);
        currentPipePos[0] = newXcoord;
    }
    waitTime += animationTime;
    console.log("DNRP => spinUp ".concat(spinUp, ", MV ").concat(isMovingVertically, ", NW ").concat(isMovingNorthWest, ", wait ").concat(waitTime));
    //ATEMPT FIX BY CHANGING SECOND VARIABLE TO BE !isMovingNorthWest, used to be Math.random() >= 0.5
    drawNewRandomPipe(!isMovingVertically, Math.random() >= 0.5, count - 1);
}
function getRandomInt(min, max) {
    var minCeiled = Math.ceil(min);
    var maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
