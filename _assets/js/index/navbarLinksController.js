/**
 * Bind to a series of unique links with hrefs set to anchors on the page
 * Disable the link representing the section of the page we best lie inside
 * Provide a smooth scroll to the anchor points when clicked if not on mobile
 *
 * NOTE: linkIds must be provided in the order in which their anchors would appear on page
 *
 * Construct with the following hash:
 * {array} linkIds, An array of strings representing unique selectors for links with an anchor to a section of the page
 * {int} navbarOffset, The height of the navbar
 *
 * @param {object} [opts] - An optional hash used for setup, as described above.
 */
const NavbarLinksController = function (opts) {
    const $window = $(window);
    // An array of link objects, each containing a $navLink jquery object and
    // a $linkPoint jquery object the navLink anchors to
    let links = [];
    let $lastDisabled = $(null);

    const init = function () {
        // Initialize the links array
        opts.linkIds.forEach(setPanes);
        // Bind a rate-limited check for what $linkPoint the window is centered on
        const rateLimitedCheckLocation = new RateLimiter(checkLocation, 200);
        rateLimitedCheckLocation.run();
        window.addEventListener('scroll', rateLimitedCheckLocation.run);
    };

    /**
     * Creates a link object for the provided linkId selector
     * @param linkId - A selector that uniquely identifies a link with an href pointing to an anchor on the page
     */
    const setPanes = function (linkId) {
        const $navLink = $(linkId);
        const $linkPoint = $($navLink.attr('href').substring(1));
        links.push({$navLink: $navLink, $linkPoint: $linkPoint});
        $navLink.on("click", function (e) {
            e.preventDefault();
            // Replace normal anchor jumping with smooth scrolling effect
            navigateToPane($linkPoint);
        });
    };

    /**
     * Identify which anchor our page is centered around
     */
    const checkLocation = function () {
        const windowHeight = $window.height();
        const scrollLoc = $window.scrollTop();

        // The last link is active if we are very close to the end of the page
        // This is necessary for thin footer sections that might have a nav link
        if ((windowHeight + scrollLoc) >= $(document).height() - 10) {
            setNewDisabled(links[links.length-1].$navLink);
            return;
        }
        for (let x=links.length-1; x>=1; x--) {
            if (scrollLoc + 0.5*windowHeight >= (links[x].$linkPoint.offset().top - opts.navbarOffset - 10)) {
                setNewDisabled(links[x].$navLink);
                return;
            }
        }
        setNewDisabled(links[0].$navLink);
    };

    /**
     * Disable the provided link if it is not already disabled
     * @param $navLink - Jquery link object
     */
    const setNewDisabled = function ($navLink) {
        if (!$lastDisabled.is($navLink)) {
            $lastDisabled.removeClass("active disabled");
            $lastDisabled = $navLink;
            $lastDisabled.addClass("active disabled");
        }
    };

    /**
     * Animate the page moving to the anchor if we are not on a mobile device
     * @param $linkPoint - Jquery anchor object
     */
    const navigateToPane = function ($linkPoint) {
        if ($window.width() >= 576) {
            $('html, body').animate({
                scrollTop: ($linkPoint.offset().top - opts.navbarOffset)
            }, 1000);
        } else {
            $window.scrollTop($linkPoint.offset().top - opts.navbarOffset);
        }
    };

    init();
};
