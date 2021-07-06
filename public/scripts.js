$(".get-start-button").click(() => {
  $(".shortener-form-input").focus();
});

$(".burger").click(() => {
  $(".nav-items").toggleClass("nav-items-active");
  $(".nav-bar").toggleClass("colorise-nav");
});

function copyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
}

const copyText = (evt) => {
  var clipboardText = "";

  clipboardText = $("#ipURl").val();

  copyToClipboard(clipboardText);
  $("#copy-btn").html("Copied");
};
