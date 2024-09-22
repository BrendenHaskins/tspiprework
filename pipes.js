//brenden haskins
//dimensions of the canvas element
var height = window.innerHeight;
var width = window.innerWidth;
//total amount of lines to draw
var lineCount = 10;
/**
 * amount of space (in pixels) along which a pipe may not start on a given axis
 * for my sake, this means that a margin of 100 will not allow a pipe to start on the
 * first 100 or last one hundred pixels of a viewport's inner dimension.
 *
 * for responsive purposes, this should be proportional to either height or width.
 */
var xMargin = Math.floor(width / 10);
var yMargin = Math.floor(height / 10);
//width of a pipe
var CHOSEN_WIDTH = 6;
//total pipes to draw, where a single pipe starts along the border and randomly moves until it hits a border
var totalPipesToDraw = 10;
//total pipes drawn so far
var pipeCount = 0;
//animation time constant
var ANIMATION_TIME = 1000;
//wait time
var currentWaitTime = 0;
//how much to increment the wait time in ms
var INCREMENT_WAIT_TIME = 1000;
//color array for changing chosen color, adds a sense of depth to the animation
var allColors = ['blue', 'cyan', 'dodgerblue', 'lightblue', 'aquamarine', 'darkseagreen', 'deepskyblue', 'darkblue', 'darkslateblue', 'lavender'];
//all instructions to execute
var allInstructions = [];
//a string to hold a seed of all instructions
var instructionSeed = "";
var canvas = SVG()
    .addTo('.target')
    .size(width, height);
window.addEventListener('DOMContentLoaded', function (e) {
    while (pipeCount <= totalPipesToDraw) {
        generateInitialInstruction();
    }
    allInstructions.forEach(executePipeInstruction);
    instructionSeed = JSON.stringify(allInstructions);
    console.log(instructionSeed);
});
//animate function
function executePipeInstruction(input) {
    //extract values from input PipeInstruction obj
    var oldPosition = input.oldPosition;
    var newPosition = input.newPosition;
    var chosenColor = input.chosenColor;
    var chosenWidth = input.chosenWidth;
    var animationTime = input.animationTime;
    var waitTime = input.waitTime;
    //execute 
    var initialPipe = canvas.line(input.oldPosition[0], input.oldPosition[1], oldPosition[0], oldPosition[1]).stroke({ color: chosenColor, width: chosenWidth });
    initialPipe.animate(animationTime, waitTime).plot(oldPosition[0], oldPosition[1], newPosition[0], newPosition[1]);
}
//generate non-initial instructions
function generateNewInstruction(oldPosition, isMovingAlongYAxis, isMovingNorthEast) {
    //distance in pixels to jump, must be changed
    var distance = 0;
    //track if instruction will cause a line to reach a border of the viewport (neccesitates termination of this pipe)
    var hasReachedBorder = false;
    /**
    *if statements to logically sort out how to change distance
    *for my sake, if a pipe is moving along the y axis, if it is moving North,
    *generate a new position containing a lesser y (index 1 - second number)
    *
    *a pipe should move no less the margin of the travelling axis, and no more than the travelling axis size minus it's respective margin
    */
    if (isMovingAlongYAxis) {
        distance = generateRandomNumber(yMargin, height - yMargin);
    }
    else {
        distance = generateRandomNumber(xMargin, width - xMargin);
    }
    //if moving north or east, we should approach zero (distance should be negative)
    if (isMovingNorthEast) {
        distance = distance * -1;
    }
    var newPosition = [oldPosition[0], oldPosition[1]];
    if (isMovingAlongYAxis) {
        newPosition[1] = newPosition[1] + distance;
        if (newPosition[1] <= 0) {
            newPosition[1] = 0;
            hasReachedBorder = true;
        }
        if (newPosition[1] >= height) {
            newPosition[1] = height;
            hasReachedBorder = true;
        }
    }
    else {
        newPosition[0] = newPosition[0] + distance;
        if (newPosition[0] <= 0) {
            newPosition[0] = 0;
            hasReachedBorder = true;
        }
        if (newPosition[0] >= width) {
            newPosition[0] = width;
            hasReachedBorder = true;
        }
    }
    var inputInstruction = {
        oldPosition: oldPosition,
        newPosition: newPosition,
        chosenColor: allColors[pipeCount % allColors.length],
        chosenWidth: CHOSEN_WIDTH,
        animationTime: ANIMATION_TIME,
        waitTime: currentWaitTime += INCREMENT_WAIT_TIME
    };
    allInstructions.push(inputInstruction);
    //if we have not reached a border, we must continue creating instructions for this pipe
    if (!hasReachedBorder) {
        generateNewInstruction(newPosition, !isMovingAlongYAxis, generateRandomBoolean());
    }
}
//generate initial instructions
function generateInitialInstruction() {
    //remember to track how many initial instructions have been issued
    pipeCount = pipeCount + 1;
    //two index arrays for creating an instruction, both indexes must be changed (x,y)
    var oldPosition = [-10, -10];
    //randomly choose which direction to go in
    var isMovingAlongYAxis = generateRandomBoolean();
    var isStartingTopRight = generateRandomBoolean();
    //a pipe starting at the top of viewport cannot move north, at the rightmost point cannot move east
    var isMovingNorthEast = !isStartingTopRight;
    //use chosen direction to dictate starting point (to move vertically, a pipe must begin along the x axis)
    isMovingAlongYAxis == true ? oldPosition[0] = generateRandomNumber(xMargin, width - xMargin) : oldPosition[1] = generateRandomNumber(yMargin, height - yMargin);
    //other index must be set to minimum value or maximum value
    var minOrMax;
    if (isStartingTopRight) {
        minOrMax = 0;
    }
    else {
        isMovingAlongYAxis == true ? minOrMax = height : minOrMax = width;
    }
    oldPosition[oldPosition.indexOf(-10)] = minOrMax;
    generateNewInstruction(oldPosition, isMovingAlongYAxis, isMovingNorthEast);
}
//a reasonable man is driven to write a random boolean function
function generateRandomBoolean() {
    return Math.random() < 0.5;
}
//generate random number
function generateRandomNumber(min, max) {
    var minCeiled = Math.ceil(min);
    var maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
//declare class
var PipeInstruction = /** @class */ (function () {
    function PipeInstruction(oldPosition, newPosition, chosenColor, chosenWidth, animationTime, waitTime) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.chosenColor = chosenColor;
        this.chosenWidth = chosenWidth;
        this.animationTime = animationTime;
        this.waitTime = waitTime;
    }
    return PipeInstruction;
}());
