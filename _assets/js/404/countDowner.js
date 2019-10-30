/**
 * A simple countdown with a visual output and callback function.
 *
 * Construct with the following hash:
 * {string} beforeString, String before the current count time
 * {string} afterString, String after the current count time
 * {function} callback, Function to call after the timer finishes
 * {int} startingTime, How many seconds to start the timer from
 * {string} tagIdSelector, selector for the timer to replace text of
 *
 * @param {object} [opts] - An optional hash used for setup, as described above.
 */
var CountDowner = function (opts) {
    const beforeString = opts.beforeString;
    const afterString = opts.afterString;
    const callback = opts.callback;
    let startingTime = opts.startingTime;
    let $tagId = $(opts.tagIdSelector);
    let timer;

    var init = function () {
        timer = setInterval(updateDisplay, 1000);
    };

    var updateDisplay = function () {
        startingTime--;
        $tagId.text(beforeString + startingTime + afterString);
        if (startingTime<=0) {
            callback();
            clearInterval(timer);
        }
    };

    init();
};
