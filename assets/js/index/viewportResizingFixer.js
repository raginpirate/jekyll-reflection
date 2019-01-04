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

    const init = function () {
        for (let index in opts) {
            $pane = $(index);
            if (opts[index].includes("height")) {
                $pane.css(opts[index], $pane.height());
            } else {
                $pane.css(opts[index], $pane.width());
            }
        }
    };

    init();
};
