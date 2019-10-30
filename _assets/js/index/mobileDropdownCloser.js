/**
 * Forcefully close the expandable mobile navbar if a click/touch happens outside of it
 *
 * Construct with the following hash:
 * {string} mainNavHeaderSelector, selector for the entire navbar
 * {string} mainNavButtonSelector, selector for the navbar expand button
 * {string} mainNavCollapseSelector, selector for the collapsible section of the navbar
 *
 * @param {object} [opts] - An optional hash used for setup, as described above.
 */
const MobileDropdownCloser = function (opts) {
    const $mainNavHeader = $(opts.mainNavHeaderSelector);
    const $mainNavButton = $(opts.mainNavButtonSelector);
    const $mainNavCollapse = $(opts.mainNavCollapseSelector);

    const init = function () {
        $(document).bind('click touchend', tryCloseDropdown);
    };

    const tryCloseDropdown = function (e) {
        const $target = $(e.target);
        if (!($target.is($mainNavHeader) || $target.is($mainNavButton) ||
            $mainNavButton.is('.collapsed') || ($(document).width() > 575))) {
            $mainNavCollapse.collapse('hide');
        }
    };

    init();
};
