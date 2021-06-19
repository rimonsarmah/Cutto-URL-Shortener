$(".burger").click(() => {
  $(".nav-links").toggleClass("nav-active");
});

$("#success-page-btn").click(() => {
  location.replace("/");
});
