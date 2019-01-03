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
const HiddenElementsStyler = function (opts) {
    let $invisibleElems = {};
    let interval;
    const init = function () {
        const $window = $(window);
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        for (let key in opts) {
            let $elem = $(key);
            if ($elem.offset().top - scrollLoc >= windowHeight) {
                //element is not visible!
                $elem.addClass(opts[key].join(" "));
                $invisibleElems[key] = [$elem, opts[key].join(" ")];
            }
        }
        interval = setInterval(checkTrigger, 250);
    };

    const checkTrigger = function () {
        const $window = $(window);
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        for (let key in $invisibleElems) {
            let $elem = $invisibleElems[key][0];
            if ($elem.offset().top - (scrollLoc + windowHeight/2) <= windowHeight/3) {
                $elem.removeClass($invisibleElems[key][1]);
                delete $invisibleElems[key];
            }
            break;
        }
        if ($invisibleElems.length == 0) {
            interval.clearInterval();
        }
    };

    init();
};
