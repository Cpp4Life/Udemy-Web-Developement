// $(document).keypress(function (event) {
//     console.log(event.key);
//     $("h1").text(event.key);
// });

$("button").click(function () {
    $("h1").animate({
        margin: 10,
        opacity: 0.5
    });
});