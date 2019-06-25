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
    const $window = $(window);
    let $invisibleElems = [];
    let interval;

    const init = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        for (let key in opts) {
            $(key).each(function () {
                let $elem = $(this);
                const offsetTop = $elem.offset().top;
                const isPast = offsetTop < (scrollLoc + windowHeight);
                if (!isPast) {
                    opts[key]["hideTrigger"]($elem);
                    $invisibleElems.push({$elem: $elem, showTrigger: opts[key]["showTrigger"]});
                }
            });
        }
        interval = setInterval(checkTrigger, 200);
    };

    const checkTrigger = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        var len = 0;
        for (let index in $invisibleElems) {
            len++;
            let $elem = $invisibleElems[index].$elem;
            const offsetTop = $elem.offset().top;
            const isPast = offsetTop < (scrollLoc + windowHeight);
            if (isPast) {
                $invisibleElems[index]["showTrigger"]($elem);
                delete $invisibleElems[index];
                return;
            }
        }
        if (len === 0) {
            clearInterval(interval);
        }
    };

    //timeout init to wait for page location to settle down (hoping to an ID anchor for example)
    setTimeout(init, 250);
};
