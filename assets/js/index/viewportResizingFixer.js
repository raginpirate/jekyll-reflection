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
const ViewportResizingFixer = function (opts) {
    let windowHeight = $(window).height();

    const init = function () {
        opts.paneSelectors.forEach(setPaneHeights);
    };

    const setPaneHeights = function (value, index, array) {
        $pane = $(value);
        $pane.css({"min-height": $pane.height()});
    };

    init();
};
