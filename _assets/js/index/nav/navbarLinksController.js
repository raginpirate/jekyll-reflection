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
    let $mainNavCollapse = $(opts.navbarId);
    let $mobileHomeButton = $(opts.mobileHomeButtonSelector);
    let $window = $(window);
    let $panes = [];
    let $navLinks = [];
    let $lastDisabled;

    const init = function () {
        opts.paneIds.forEach(setPanes);
        $lastDisabled = $navLinks[0];
        setInterval(checkLocation, 250);
        $mobileHomeButton.click(function () {
            $window.scrollTop(0);
        });
        if ($window.scrollTop() == 0) {
            $("#navbar").addClass("bg-transparent");
            $window.one("scroll click", function() {
                $("#navbar").removeClass("bg-transparent");
            });
        }
    };

    const setPanes = function (value, index, array) {
        $panes.push($(value));
        $navLinks.push($mainNavCollapse.find('#' + $panes[index].data("navId")));
        $navLinks[index].on("click", function() {
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
        for (let x=$panes.length-2; x>=1; x--) {
            if (scrollLoc >= ($panes[x].offset().top - opts.navbarOffset - 10)) {
                setNewDisabled(x);
                return;
            }
        }
        setNewDisabled(0);
    };

    const setNewDisabled = function (index) {
        if ($lastDisabled != $navLinks[index]) {
            if (index == 0) {
                $mobileHomeButton.removeClass("show flip");
            } else if($lastDisabled == $navLinks[0]) {
                $mobileHomeButton.addClass("show flip");
            }
            $lastDisabled.removeClass("disabled");
            $lastDisabled = $navLinks[index];
            $lastDisabled.addClass("disabled");
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
