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
const NavbarLinkLocator = function (opts) {
    let mainNavCollapse = document.getElementById(opts.navbarId);
    let documentPanes = [];
    let navLinks = [];
    let lastDisabled;

    const init = function () {
        opts.paneIds.forEach(setPanes);
        lastDisabled = navLinks[0];
        setInterval(checkLocation, 250);
    };

    const setPanes = function (value, index, array) {
        documentPanes.push(document.getElementById(value));
        navLinks.push(mainNavCollapse.querySelector('#' + documentPanes[index].dataset.navId));
        navLinks[index].addEventListener("click", function() {
            navigateToPane(index);
        });
    };

    const checkLocation = function (e) {
        const scrollLoc = document.scrollingElement.scrollTop;
        const windowHeight = window.innerHeight;
        if ((windowHeight + scrollLoc) >= document.body.offsetHeight - 10) {
            setNewDisabled(documentPanes.length-1);
            checkGreyscaled(scrollLoc, windowHeight);
            return;
        }
        for (let x=documentPanes.length-2; x>=1; x--) {
            if (scrollLoc >= (documentPanes[x].offsetTop - opts.navbarOffset - 10)) {
                setNewDisabled(x);
                checkGreyscaled(scrollLoc, windowHeight);
                return;
            }
        }
        setNewDisabled(0);
        checkGreyscaled(scrollLoc, windowHeight);
    };

    const setNewDisabled = function (index) {
        if (lastDisabled != navLinks[index]) {
            lastDisabled.className = "nav-link";
            lastDisabled = navLinks[index];
            lastDisabled.className = "nav-link disabled";
        }
    };

    const checkGreyscaled = function (scrollLoc, windowHeight) {
        for(let index=0; index<documentPanes.length; index++) {
            const distanceTop = documentPanes[index].offsetTop - (scrollLoc + windowHeight/2);
            const distanceBottom = documentPanes[index].offsetTop + documentPanes[index].clientHeight - (scrollLoc + windowHeight/2);
            if (Math.abs(distanceTop) <= windowHeight/3 || Math.abs(distanceBottom) <= windowHeight/3 || (distanceTop < 0 && distanceBottom > 0)) {
                documentPanes[index].classList.remove("greyscale");
            } else {
                documentPanes[index].classList.add("greyscale");
            }
        }
    };

    const navigateToPane = function (index) {
        let $window = $(window);
        if ($window.width() >= 576) {
            $('html, body').animate({
                scrollTop: (documentPanes[index].offsetTop - opts.navbarOffset)
            }, 1000);
        } else {
            $window.scrollTop(documentPanes[index].offsetTop - opts.navbarOffset);
        }

    };

    init();
};
