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
const ProjectSwitcher = function (opts) {
    let $linkContainer = $(opts.projectLinksSelector);
    let $curElem;
    let notMobile = $(window).width() >= 576;
    let lastScrollLoc;

    const init = function() {
        $linkContainer.find(".project-link").each(function () {
            $(this).click(setVisiblePage);
            $("#" + $(this).data("page-id")).find(".block-popup-btn").click(resetPage);
        });
    };

    const setVisiblePage = function(e) {
        e.preventDefault();
        if ($linkContainer.css('overflow') != 'hidden' && $linkContainer.css('display') != 'none') {
            lastScrollLoc = $(window).scrollTop();
            $curElem = $("#" + $(this).data("page-id"));
            if(notMobile) {
                $('html, body').animate({
                    scrollTop: ($("#page3").offset().top - 56)
                }, 1000);
                $linkContainer.slideUp(1000);
                $curElem.slideDown(1000);
            } else {
                $linkContainer.hide();
                $curElem.fadeIn(1500);
                $(window).scrollTop($("#page3").offset().top - 56);
            }
        }
    };

    const resetPage = function(e) {
        e.preventDefault();
        if(notMobile) {
            $('html, body').animate({
                scrollTop: lastScrollLoc
            }, 1000);
            $curElem.slideUp();
            $linkContainer.slideDown();
        } else {
            $curElem.hide();
            $linkContainer.fadeIn(1500);
            $(window).scrollTop(lastScrollLoc);
        }
    };

    init();
};
