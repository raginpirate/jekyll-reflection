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
var CountDowner = function (opts) {
    var beforeString = opts.beforeString;
    var afterString = opts.afterString;
    var startingTime = opts.startingTime;
    var $tagId = $(opts.tagIdSelector);
    var callback = opts.callback;
    var timer;

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