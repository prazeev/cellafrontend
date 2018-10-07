$(function() {
    function createCookie(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }
    var base_url = "http://localhost:1337/"
    $(".loginForm").submit(function(e) {
        e.preventDefault();
        $("#loginSubmit").prop("disabled",true)
        var actionurl = `${base_url}auth/local/`;
        $.ajax({
            url: actionurl,
            method: 'POST',
            data: $('.loginForm').serialize(),
            success: function(output) {
                $("#loginSubmit").prop("disabled",false)
                createCookie("token",output.jwt, 999999)
                createCookie("Fullname",output.user.Fullname, 999999)
                createCookie("userId", output.user.id, 999999)
                createCookie("Address",output.user.Address, 999999)
                createCookie("Gender",output.user.Gender, 999999)
                swal("Logged in!", `Welcome ${output.user.Fullname}`,"success")
                window.location.replace("/");
            },
            error: function (error) {
                $("#loginSubmit").prop("disabled",false)
                swal("Error!", "Username and password not found on database!","error")
            }
        })
    })
})