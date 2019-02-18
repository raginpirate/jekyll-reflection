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
    let $linkContainer = $(opts.linkContainerSelector);
    let $window = $(window);
    let $page = $('html, body');
    let notMobile = $window.width() >= 576;
    let projectDataName = opts.projectIdDataName;
    let $topContainer = $(opts.topContainerSelector);
    let $curElem;
    let lastScrollLoc;

    const init = function() {
        $linkContainer.find(opts.projectLinksSelector).each(function () {
            $(this).click(setVisiblePage);
            const $projectPage = $("#" + $(this).data(projectDataName));
            $projectPage.find(opts.btmResetBtnSelector).click(btmReset);
            $projectPage.find(opts.topResetBtnSelector).click(topReset);
        });
    };

    const setVisiblePage = function(e) {
        e.preventDefault();
        if ($linkContainer.css('overflow') !== 'hidden' && $linkContainer.css('display') !== 'none') {
            lastScrollLoc = $window.scrollTop();
            $curElem = $("#" + $(this).data(projectDataName));
            if(notMobile) {
                $page.animate({
                    scrollTop: ($topContainer.offset().top - 47)
                }, 1000);
                e.preventDefault();
                $linkContainer.slideUp(1000);
                $curElem.slideDown(1000);
            } else {
                $linkContainer.hide();
                $curElem.fadeIn(1500);
                $window.scrollTop($topContainer.offset().top - 47);
            }
        }
    };

    const topReset = function(e) {
        e.preventDefault();
        if(notMobile) {
            $page.animate({
                scrollTop: lastScrollLoc
            }, 1000);
            $curElem.slideUp();
            $linkContainer.slideDown();
        } else {
            $curElem.hide();
            $linkContainer.fadeIn(1500);
            $window.scrollTop(lastScrollLoc);
        }
    };

    const btmReset = function(e) {
        e.preventDefault();
        if(notMobile) {
            $page.animate({
                scrollTop: lastScrollLoc
            }, 1000);
            $curElem.slideUp(1000);
            $linkContainer.slideDown(1000);
        } else {
            $curElem.hide();
            $linkContainer.fadeIn(1500);
            $window.scrollTop(lastScrollLoc);
        }
    };

    init();
};
