/**
 * A simple object to rate limit a provided function to once per provided interval.
 * If over-called within an interval, the function will be called an extra time at the end of the interval.
 * It will not release the rate-limited status for another interval should this happen.
 *
 * Usage:
 * let rateLimitedFn = RateLimiter(fn, 500);
 * rateLimitedFunction.run();
 *
 * Construct with the following:
 * @param {function} fn, function to rate limit
 * @param {int} timeout, interval to rate limit calls for, in milliseconds
 */
const RateLimiter = function (fn, timeout) {
    let notLimited = true;
    let gotRateLimited = false;

    this.run = function () {
        if (notLimited) {
            notLimited = false;
            callThenTimeout();
        } else if (!gotRateLimited) {
            gotRateLimited = true;
        }
    };

    const callThenTimeout = function () {
        fn();
        setTimeout(function () {
            if (gotRateLimited) {
                gotRateLimited = false;
                callThenTimeout();
            } else {
                notLimited = true;
                gotRateLimited = false;
            }
        }, timeout);
    };
};
