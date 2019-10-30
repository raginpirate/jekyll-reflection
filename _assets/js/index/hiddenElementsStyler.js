/**
 * Style a bunch of matching hidden elements, and then style them again when they get seen.
 * Triggers will be passed a jquery object representing an element matched by the key.
 *
 * Construct a hash where:
 * Every key is an element selector (unique or non-unique),
 * Every value is an object with:
 * {function} hideTrigger - A function to be triggered when the element is not visible on page load (one time run).
 * {function} showTrigger - A function to be triggered when the element goes from hidden to revealed (one time run).
 *
 * @param {object} [opts] - An optional hash used for setup, as described above.
 */
const HiddenElementsStyler = function (opts) {
    const $window = $(window);
    let invisibleElems = [];
    let interval;

    /**
     * For every matching element of a key in opts:
     * If it is hidden, run the key's hideTrigger and push the elem along with the showTrigger into invisibleElems
     */
    const init = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        for (let key in opts) {
            $(key).each(function () {
                let $elem = $(this);
                const offsetTop = $elem.offset().top;
                const isPast = offsetTop < (scrollLoc + windowHeight);
                if (!isPast) {
                    opts[key].hideTrigger($elem);
                    invisibleElems.push({$elem: $elem, showTrigger: opts[key]["showTrigger"]});
                }
            });
        }
        // Check periodically if an element has been seen
        interval = setInterval(checkTrigger, 200);
    };

    /**
     * Trigger any revealed element's showtrigger and splice it out of the array
     * We return after one removal so that there is a gradual reveal effect if someone scrolls quickly
     */
    const checkTrigger = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();
        for (let index in invisibleElems) {
            let $elem = invisibleElems[index].$elem;
            const offsetTop = $elem.offset().top;
            const isPast = offsetTop < (scrollLoc + windowHeight);
            if (isPast) {
                invisibleElems[index].showTrigger($elem);
                invisibleElems.splice(index, 1);
                return;
            }
        }
        if (invisibleElems.length === 0) {
            clearInterval(interval);
        }
    };

    init();
};
