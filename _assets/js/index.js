//= require_tree ./index

$(document).ready(function () {
    HiddenElementsStyler({
        "#aboutBackground": {
            showTrigger: function ($elem) {
                // Animate the expansion of the page
                const windowWidth = $(window).width();
                if (windowWidth > 1366) {
                    $elem.animate({"max-width": windowWidth}, {
                        easing: "swing", duration: 1000, complete: function () {
                            $elem.css("max-width", "");
                        }
                    });
                } else {
                    $elem.css("max-width", "");
                }
            }, hideTrigger: function ($elem) {
                // Fix the width of this page
                $elem.css("max-width", "1366px");
            }
        },
        ".container-fluid": {
            showTrigger: function ($elem) {
                // Let the page slowly fill with color
                let greyscaleLevel = 1;
                let interval = setInterval(function () {
                    greyscaleLevel -= 0.10;
                    $elem.css("filter", "grayscale(" + greyscaleLevel + ")");
                    if (greyscaleLevel <= 0) {
                        $elem.css("filter", "");
                        clearInterval(interval);
                    }
                }, 50);
            }, hideTrigger: function ($elem) {
                // Greyscale the page
                $elem.css("filter", "grayscale(1)");
            }
        },
        ".card": {
            showTrigger: function ($elem) {
                // Reveal and fill the cards with color
                let greyscaleLevel = 1;
                $elem.animate({opacity: 1}, 250);
                let interval = setInterval(function () {
                    greyscaleLevel -= 0.10;
                    $elem.css("filter", "grayscale(" + greyscaleLevel + ")");
                    if (greyscaleLevel <= 0) {
                        $elem.css("filter", "");
                        clearInterval(interval);
                    }
                }, 50);
            }, hideTrigger: function ($elem) {
                // Greyscale and hide each card
                $elem.css("filter", "grayscale(1)");
                $elem.css("opacity", "0");
            }
        }
    });

    MobileDropdownCloser({
        mainNavHeaderSelector: '#homeNav',
        mainNavButtonSelector: '#homeNavButton',
        mainNavCollapseSelector: '#homeCollapseNav'
    });

    NavbarLinksController({
        linkIds: ["#navToHome", "#navPage1", "#navPage2", "#navPage3", "#navPage4"],
        navbarOffset: 56
    });
});
