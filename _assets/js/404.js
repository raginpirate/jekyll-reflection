//= require_tree ./404
$(document).ready(function() {
    var countDowner = new CountDowner({
        beforeString: "Redirecting in ",
        afterString: "s..",
        startingTime: 5,
        tagIdSelector: "#timer",
        callback: function () {
            window.location.pathname = "/";
        }
    });
});
