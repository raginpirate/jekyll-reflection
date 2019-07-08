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
const NavbarLinksController = function (opts) {
    let $window = $(window);
    let $panes = [];
    let $navLinks = [];
    let $lastDisabled;

    const init = function () {
        opts.paneIds.forEach(setPanes);
        $lastDisabled = $(null);
        checkLocation();
        setInterval(checkLocation, 100);
    };

    const setPanes = function (value, index, array) {
        $navLinks.push($(value));
        $panes.push($($navLinks[index].attr('href').substring(1)));
        $navLinks[index].on("click", function(e) {
            e.preventDefault();
            navigateToPane(index);
        });
    };

    const checkLocation = function (e) {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();

        if ((windowHeight + scrollLoc) >= $(document).height() - 10) {
            setNewDisabled($panes.length-1);
            return;
        }
        for (let x=$panes.length-1; x>=1; x--) {
            if (scrollLoc >= ($panes[x].offset().top - opts.navbarOffset - 10)) {
                setNewDisabled(x);
                return;
            }
        }
        setNewDisabled(0);
    };

    const setNewDisabled = function (index) {
        if ($lastDisabled !== $navLinks[index]) {
            $lastDisabled.removeClass("active disabled");
            $lastDisabled = $navLinks[index];
            $lastDisabled.addClass("active disabled");
        }
    };

    const navigateToPane = function (index) {
        if ($window.width() >= 576) {
            $('html, body').animate({
                scrollTop: ($panes[index].offset().top - opts.navbarOffset)
            }, 1000);
        } else {
            $window.scrollTop($panes[index].offset().top - opts.navbarOffset);
        }

    };

    init();
};
