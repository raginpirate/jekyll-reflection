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
const RateLimiter = function (fn, timeout) {
    let notLimited = true;
    let gotRateLimited = false;

    this.run = function() {
        if (notLimited) {
            notLimited = false;
            callThenTimeout();
        } else {
            gotRateLimited = true;
        }
    };

    const callThenTimeout = function() {
        fn();
        setTimeout(function() {
            if (gotRateLimited) {
                gotRateLimited = false;
                callThenTimeout(fn, timeout);
            } else {
                notLimited = true;
                gotRateLimited = false;
            }
        }, timeout);
    };
};
