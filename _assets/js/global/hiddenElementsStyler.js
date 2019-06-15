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
                const appendableClasses = opts[key]["classes"].join(" ");
                if (!isPast) {
                    $elem.addClass(appendableClasses);
                    $invisibleElems.push({$elem: $elem, classList: appendableClasses});
                }
            });
        }
        interval = setInterval(checkTrigger, 250);
    };

    const checkTrigger = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        var len = 0;
        for (let index in $invisibleElems) {
            len++;
            let $elem = $invisibleElems[index].$elem;
            const offsetTop = $elem.offset().top;
            const distanceTop = offsetTop - (scrollLoc + windowHeight/2);
            const distanceBottom = offsetTop + $elem.height() - (scrollLoc + windowHeight/2);
            const isVisible = Math.abs(distanceTop) <= windowHeight/3 || Math.abs(distanceBottom) <= windowHeight/3 || (distanceTop < 0 && distanceBottom > 0);
            if (isVisible) {
                $elem.css("transition", "all 1s ease-in-out");
                $elem.removeClass($invisibleElems[index].classList);
                setTimeout(function(){$elem.css("transition", "");}, 1000);
                delete $invisibleElems[index];
                return;
            }
        }
        if (len === 0) {
            clearInterval(interval);
        }
    };

    //timeout init because of issue with page location after refresh
    //setTimeout(init, 100);
    init();
};
