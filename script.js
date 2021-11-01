var fariables = {};
if (window.location.protocol == "http:") {
    window.location.href = window.location.href.replace("http://", "https://")
 }
function countOccurences(string, word) {
    return string.split(word).length - 1;
}
function dbUC() {
    fariables.dbURL = $("#url").val();
    $.get(`https://api.codetabs.com/v1/proxy/?quest=${fariables.dbURL}`, (data) => {
        $(".main").html(`<p>Choose an MRN to release<p><iframe style="border: none;" src="data:text/plain,${((data) => {
            var mrns = [];
            data.replaceAll(/(\r\n|\r|\n){2,}/g, '$1\n').split("\n").forEach(piece => {
                if (piece.includes("HIV")) {
                    mrns.push(piece.split(":")[1] + "(HIV)");
                }
                else if (countOccurences(data, piece) >= 2) {
                    mrns.push(piece.split(":")[1] + "(dupe)");
                }
                else {
                    mrns.push(piece.split(":")[1]);
                }
            });
            mrns.forEach((mrn,index) => {
                if (mrn.includes("undefined")) {
                    mrns.splice(index, 1);
                }
            });
            return mrns.join("\n");
        })(data)}"></iframe><br><input type="number" id="mrn"><input type="submit" value="Release MRN" onclick="mrnC();">`);
    })
}
function mrnC() {
    var mrn = $("#mrn").val();
    var done = false;
    $.get(`https://api.codetabs.com/v1/proxy/?quest=${fariables.dbURL}`, (data) => {
        data.split("\n").forEach(piece => {
              if (piece.split(":")[1] === mrn.toString()) {
                    if (done) {
                        false;
                    } else {
                        var text = piece.split(":")[2].split(".").join(": ")
                        window.open(`mailto:${piece.split(":")[0]}?subject=${mrn}&body=${encodeURIComponent(text)}`);
                        done = true;
                    }
              }          
        });
        done = false;
    });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}