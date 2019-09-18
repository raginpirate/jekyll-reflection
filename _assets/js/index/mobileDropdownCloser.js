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
const MobileDropdownCloser = function (opts) {
    const $mainNavHeader = $(opts.mainNavHeaderSelector);
    const $mainNavButton = $(opts.mainNavButtonSelector);
    const $mainNavCollapse = $(opts.mainNavCollapseSelector);

    const init = function () {
        $(document).bind('click touchend', tryCloseDropdown);
    };

    const tryCloseDropdown = function (e) {
        const $target = $(e.target);
        if (!($target.is($mainNavHeader) || $target.is($mainNavButton) || $mainNavButton.is('.collapsed') || ($(document).width() > 575))) {
            $mainNavCollapse.collapse('hide');
        }
    };

    init();
};
