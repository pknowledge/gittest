
var img_path = "";
(function () {
    var nativeSetTimeout = window.setTimeout;

    window.bindTimeout = function (listener, interval) {
        function setTimeout(code, delay) {
            var elapsed = 0,
                h;

            h = window.setInterval(function () {
                elapsed += interval;
                if (elapsed < delay) {
                    listener(delay - elapsed);
                } else {
                    window.clearInterval(h);
                }
            }, interval);
            return nativeSetTimeout(code, delay);
        }

        window.setTimeout = setTimeout;
        setTimeout._native = nativeSetTimeout;
    };
} ());

$(document).ready(function (e) {
    $("#CaptchaImg").hide();
    $("#search-form").hide();
          $('input[type="submit"]').prop('disabled', true);
    //binds to onchange event of your input field
    $('#myFile').bind('change', function () {
        //this.files[0].size gets the size of your file.
        if (this.files[0].size > 10000000){
              $('input[type="submit"]').prop('disabled', true);
        alert("File size More then 10MB \n Please upload smaller File\n Your file size = "+this.files[0].size);
    } else {

              $('input[type="submit"]').prop('disabled', false);
    }
    });
    $("#uploadimage").on('submit', function (e) {

        e.preventDefault();
        $.ajax({
            url: "https://vidtogif-demo.herokuapp.com/upload/", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,        // To send DOMDocument or non processed data file it is set to false
            success: function (data)   // A function to be called if request succeeds
            {
                document.getElementById("demo").innerHTML = data;
                img_path = data;
                console.log(data);
                window.bindTimeout(function (t) {
                    console.log((t / 30000) * 100 + "ms remaining");
                    $('.progress').val(100 - ((t / 30000) * 100));
                }, 300);
                window.setTimeout(function () {
                    // do whatever you want to do

                    $("#CaptchaImg").show();
                    $("#search-form").show();
                    $("#CaptchaImg").attr("src", 'https://vidtogif-demo.herokuapp.com/output/' + img_path + '.gif');
                    $("#search-form").attr("action", 'https://vidtogif-demo.herokuapp.com/output/' + img_path + '.gif');
                }, 30000);
            }
        });

    });
});
