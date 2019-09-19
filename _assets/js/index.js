//= require global
//= require_tree ./index

const hiddenElementsStyler = new HiddenElementsStyler({
    ".about-background": {
        showTrigger: function($elem){
            if ($(window).width() > 1366) {
                $elem.animate({"max-width": $elem.data("width")}, {easing: "swing", duration: 1000, complete: function(){
                        $elem.css("max-width", "");
                    }});
            } else {
                $elem.css("max-width", "");
            }
        }, hideTrigger: function($elem){
            $elem.data("width", $elem.width());
            $elem.css("max-width", "1366px");
        }
    },
    ".container-fluid": {
        showTrigger: function($elem){
            let greyscaleLevel = 1;
            let interval = setInterval(function(){
                greyscaleLevel -= 0.10;
                $elem.css("filter", "grayscale(" + greyscaleLevel + ")");
                if(greyscaleLevel <= 0) {
                    $elem.css("filter", "");
                    clearInterval(interval);
                }
            }, 50);
        }, hideTrigger: function($elem){
            $elem.css("filter", "grayscale(1)");
        }
    },
    ".card": {
        showTrigger: function($elem){
            let greyscaleLevel = 1;
            $elem.animate({opacity: 1}, 250);
            let interval = setInterval(function(){
                greyscaleLevel -= 0.10;
                $elem.css("filter", "grayscale(" + greyscaleLevel + ")");
                if(greyscaleLevel <= 0) {
                    $elem.css("filter", "");
                    clearInterval(interval);
                }
            }, 50);
        }, hideTrigger: function($elem){
            $elem.css("filter", "grayscale(1)");
            $elem.css("opacity", "0");
        }
    }
});

const mobileDropdownCloser = new MobileDropdownCloser({
    mainNavHeaderSelector: '#homeNav',
    mainNavButtonSelector: '#homeNavButton',
    mainNavCollapseSelector: '#homeCollapseNav'
});
const navbarLinksController = new NavbarLinksController({
    paneIds: ["#navToHome", "#navPage1", "#navPage2", "#navPage3", "#navPage4"],
    navbarOffset: 56
});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/service_worker.js");
}
