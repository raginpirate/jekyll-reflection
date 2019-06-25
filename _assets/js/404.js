//= require global
//= require_tree ./404

var countDowner = new CountDowner({
    beforeString: "Redirecting in ",
    afterString: "s..",
    startingTime: 5,
    tagIdSelector: "#timer",
    callback: function() {
        window.location.pathname = "{{ site.baseurl }}";
    }
});
