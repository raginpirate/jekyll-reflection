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
var Painter = function (opts) {
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

    var init = function() {
        window.onload=function() {
            initializeCanvas();
            interval = setInterval(makeMove, 100);
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
        var worth = 0;
        for (var a = -6; a < 7; a++) {
            for (var b = -6; b < 7; b++) {
                if (q+a > -1 && q+a < WIDTH && z+b > -1 && z+b < HEIGHT) {
                    //this heuristic is awful
                    worth += currentImage.data[(q+a+(z+b)*WIDTH)*4+2] - (imgData.data[(q+a+(z+b)*WIDTH)*4+2] + 15);
                }
            }
        }
        moveWeight[q][z] = worth;
    };

    var makeMove = function() {
        var bestLoc = bestMove();
        if (bestLoc != -1) {
            dropWater(bestLoc);
            flow();
            recalcHeuristic(bestLoc);
            redraw();
        }
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
        for (var q = -6; q < 7; q++) {
            for (var z = -6; z < 7; z++) {
                if (q+bestLoc.x > -1 && q+bestLoc.x < WIDTH && z+bestLoc.y > -1 && z+bestLoc.y < HEIGHT) {
                    var color = currentImage.data[((bestLoc.x + q) + (bestLoc.y + z)*WIDTH)*4+0]-50;
                    if (color - 50 < 0) {
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

    var flow = function() {
        while (livePixelStack.length != 0) {
            shareActionPotential(influencedPixels(livePixelStack.pop()));
        }
    };

    var influencedPixels = function(livePixel) {
        var potential = canvasPotential[livePixel.x][livePixel.y];
        var influencedPixels = [];
        var choices = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1],
            [-2, -2], [-2, -1], [-2, 0], [-2, -1], [-2, -2], [-1, -2], [-1, 2], [0, -2], [0, 2], [1, -2], [1, 2], [2, -2], [2, 2]];
        while (choices.length > 0) {
            var loc = Math.floor(Math.random()*choices.length);
            var x=choices[loc][0];
            var y=choices[loc][1];
            if (Math.random() < potential/40 && livePixel.x+x > -1 && livePixel.x+x < WIDTH && livePixel.y+y > -1 && livePixel.y+y < HEIGHT) {
                potential = potential-POTENTIAL_REDUCTION;
                influencedPixels.push({x: livePixel.x+x, y: livePixel.y+y});
            }
            choices.splice(loc, 1);
        }
        canvasPotential[livePixel.x][livePixel.y] = potential;
        return influencedPixels;
    };

    var shareActionPotential = function(influencedPixels) {
        if (influencedPixels.length == 1) {
            return;
        }
        var potential = 0;
        var color = 0;
        for (var q=0; q<influencedPixels.length; q++) {
            potential += canvasPotential[influencedPixels[q].x][influencedPixels[q].y];
            color += currentImage.data[(influencedPixels[q].x + influencedPixels[q].y*WIDTH)*4+2];
        }
        for (var q=0; q<influencedPixels.length; q++) {
            canvasPotential[influencedPixels[q].x][influencedPixels[q].y] = potential/influencedPixels.length;
            currentImage.data[(influencedPixels[q].x + influencedPixels[q].y*WIDTH)*4+0] = color/influencedPixels.length;
            currentImage.data[(influencedPixels[q].x + influencedPixels[q].y*WIDTH)*4+1] = color/influencedPixels.length;
            currentImage.data[(influencedPixels[q].x + influencedPixels[q].y*WIDTH)*4+2] = color/influencedPixels.length;
        }
        if (potential > 5) {
            for (var q=0; q<influencedPixels.length; q++) {
                livePixelStack.push(influencedPixels[q]);
            }
        }
    };

    var recalcHeuristic = function(bestLoc) {
        for (var x=bestLoc.x-30; x<bestLoc.x+31; x++) {
            for (var y=bestLoc.y-30; y<bestLoc.y+31; y++) {
                if (x>0 && x<WIDTH && y>0 && y<HEIGHT) {
                    setHeuristicWeight(x, y);
                }
            }
        }
    };

    var redraw = function() {
        ctx.putImageData(currentImage, 0, 0);
    };

    init();
};
