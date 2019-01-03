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
const PageSwitcher = function (opts) {
    let $startingPage = $(opts.startingPage);
    let $curElem;
    let $sortingTable = $(opts.sortingTable);
    let notMobile = $(window).width() >= 576;
    let lastScrollLoc;

    const init = function() {
        for (let link in opts.pageLinks) {
            let $link = $(opts.pageLinks[link]);
            $link.click(setVisiblePage);
            $("#" + $link.data("page-id")).find(".block-popup-btn").click(resetStartingPage);
        }
    };

    const setVisiblePage = function(e) {
        e.preventDefault();
        lastScrollLoc = $(window).scrollTop();
        $curElem = $("#" + $(this).data("page-id"));
        $sortingTable.hide();
        if(notMobile) {
            $('html, body').animate({
                scrollTop: ($("#page3").offset().top - 56)
            }, 1000);
            $startingPage.slideUp(1000);
            $curElem.slideDown(1000);
        } else {
            $startingPage.hide();
            $curElem.fadeIn(1500);
            $(window).scrollTop($("#page3").offset().top - 56);
        }

    };

    const resetStartingPage = function(e) {
        e.preventDefault();
        $sortingTable.show();
        if(notMobile) {
            $('html, body').animate({
                scrollTop: lastScrollLoc
            }, 1000);
            $curElem.slideUp();
            $startingPage.slideDown();
        } else {
            $curElem.hide();
            $startingPage.fadeIn(1500);
            $(window).scrollTop(lastScrollLoc);
        }

    };

    init();
};
