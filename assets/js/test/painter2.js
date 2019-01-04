/**
 * THIS NEEDS REAL COMMENTS
 *
 * Construct with the following hash:
 * {string} checkboxSelector, selector for the checkbox which dictates state of fields
 * {string} endDateSelector, selector for theme field to disable/enable
 * {string} endTimeSelector, selector for theme field to disable/enable
 * {string} endThemeSelector, selector for theme field to disable/enable
 *
 * @param {object} [opts] - An optional hash used for setup, as described above.
 */
//http://127.0.0.1:4000/test
var Painter2 = function (opts) {
    const POTENTIAL_REDUCTION = 7;
    const WIDTH = 1920;
    const HEIGHT = 1080;

    var $canvas = $(opts.canvasSelector);
    var $image = $(opts.imageSelector);
    var ctx;

    var livePixelStack = [];
    var canvasPotential = [];
    var moveWeight = [];

    var currentImage;
    var imgData;

    var interval;

    var startSize = 200;
    var loopCount = 1;

    var init = function() {
        window.onload=function() {
            initializeCanvas();
            setInterval(redraw, 1000);
            interval = setInterval(makeMoveBase, 1/100);
        };
    };

    var initializeCanvas = function() {
        ctx = $canvas[0].getContext("2d");
        $canvas[0].width  = WIDTH;
        $canvas[0].height = HEIGHT;
        ctx.drawImage($image[0], 0, 0);
        imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        currentImage = ctx.createImageData(WIDTH, HEIGHT);
        //Build a pure white image
        for (var q=0; q<WIDTH; q++) {
            for (var z = 0; z < HEIGHT; z++) {
                currentImage.data[(q+z*WIDTH)*4+0] = 255;
                currentImage.data[(q+z*WIDTH)*4+1] = 255;
                currentImage.data[(q+z*WIDTH)*4+2] = 255;
                currentImage.data[(q+z*WIDTH)*4+3] = 255;
            }
        }
        //draw our pure white image
        ctx.putImageData(currentImage, 0, 0);
        //set the potential of each square to 0
        //set the initial weight of each draw location choice
        for (var q=0; q<WIDTH; q++) {
            canvasPotential[q] = [];
            moveWeight[q] = [];
            for (var z = 0; z < HEIGHT; z++) {
                canvasPotential[q][z] = 0;
                setHeuristicWeight(q, z);
            }
        }
    };

    var setHeuristicWeight = function(q, z) {
        moveWeight[q][z] = currentImage.data[(q+z*WIDTH)*4+2] - (imgData.data[(q+z*WIDTH)*4+2] + dropweight());
    };

    var makeMoveBase = function() {
        var bestLoc = bestMove();
        if (bestLoc != -1) {
            dropWater(bestLoc);
            recalcHeuristic();
        }
        loopCount++;
    };

    //this is x^2 runtime...
    var bestMove = function() {
        var bestWorth = -1;
        var bestx = -1;
        var besty = -1;
        for (var q=0; q<WIDTH; q++) {
            for (var z = 0; z < HEIGHT; z++) {
                if (moveWeight[q][z] > bestWorth) {
                    bestWorth = moveWeight[q][z];
                    bestx = q;
                    besty = z;
                }
            }
        }
        if (bestWorth > 0) {
            return {x: bestx, y: besty}
        }
        clearInterval(interval);
        return -1;
    };

    var dropWater = function(bestLoc) {
        for (var q = 0-dropsize(); q <= dropsize(); q++) {
            for (var z = 0-dropsize(); z <= dropsize(); z++) {
                if (q+bestLoc.x > -1 && q+bestLoc.x < WIDTH && z+bestLoc.y > -1 && z+bestLoc.y < HEIGHT) {
                    var color = currentImage.data[((bestLoc.x + q) + (bestLoc.y + z)*WIDTH)*4+0]-dropweight();
                    if (color < 0) {
                        color = 0;
                    }
                    canvasPotential[bestLoc.x + q][bestLoc.y + z] = Math.random() * 800 + 3000;
                    currentImage.data[((bestLoc.x + q) + (bestLoc.y + z)*WIDTH)*4+0] = color;
                    currentImage.data[((bestLoc.x + q) + (bestLoc.y + z)*WIDTH)*4+1] = color;
                    currentImage.data[((bestLoc.x + q) + (bestLoc.y + z)*WIDTH)*4+2] = color;
                    livePixelStack.push({x: bestLoc.x + q, y: bestLoc.y + z});
                }
            }
        }
    };

    var recalcHeuristic = function() {
        for (var q=0; q<WIDTH; q++) {
            for (var z = 0; z < HEIGHT; z++) {
                setHeuristicWeight(q, z);
            }
        }
    };

    var redraw = function() {
        ctx.putImageData(currentImage, 0, 0);
    };

    var dropweight = function () {
        var t = Math.ceil(Math.sqrt(loopCount));
        if (t > 20) {
            return 20;
        }
        return t;
    };

    var dropsize = function () {
        var t = Math.ceil(startSize - (Math.sqrt(loopCount)*8));
        if (t < 2) {
            return 1;
        }
        return t;
    };

    init();
};
