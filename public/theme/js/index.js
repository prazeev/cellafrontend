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

function ufirst(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
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

function fn(text, count = 200) {
    return text.slice(0, count) + (text.length > count ? "..." : "");
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
var base_url = `http://139.59.8.47:1337/`
var token = readCookie("token");
var user = readCookie("userId");
$(window).load(function () {
    function all_ads() {
        $.ajax({
            url: `${base_url}Ads?_sort=createdAt:desc&_limit=8`,
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + token
            },
            success: function (result) {
                var new_content = "";
                $.each(result, function (i, item) {
                    if (item.categories) {
                        var category = item.categories.Title
                    } else {
                        var category = "No Category"
                    }
                    new_content += `
       <div class="col-lg-3">
        <!-- START widget-->
        <div class="panel widget">
            <img src="/theme/img/bg1.jpg" alt="Image" class="img-responsive">
            <div class="panel-body">
                <div class="row ph-lg">
                    <div class="pull-left">
                        <span class="fa fa-fw fa-${item.categories.Type} main-color"></span>
                        <span class="text-muted text-xs first-uppercase main-color">${ufirst(item.categories.Type)}</span>
                    </div>
                </div>
                <div class="row mv-lg text-center ph-lg">
                    <strong class="text-overflow pull-left" title="${item.Title}"> <a
                                class="link text-inverse link-success" href="/${item.categories.Slug}/${item.id}" style="font-size:16px;">${item.Title}</a></strong>
                </div>
                <div class="row ph-lg">
                    <div class="pull-left">
                        <p style="font-size:16px;height:30px; letter-spacing: 1px">${fn(item.Description, 58)}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- END widget-->
    </div>`
                })
                $("#allAds").html(new_content)
            }
        })
    }

    function allCategories() {
        var actionUrl = `${base_url}Categories?_sort=createdAt:desc`
        $.ajax({
            url: actionUrl,
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + token
            },
            success: function (result) {
                var new_content = "";
                var new_content_second = "";
                console.log(result)
                $.each(result, function (i, item) {
                    new_content += `<option value="${item.id}">${item.Title}</option>`
                    new_content_second += `   <div class="mh-sm pv-lg">
                                                <div class="panel-body bg-white text-center">
                                                    <span class="fa fa-3x fa-${item.Type} text-green"></span>
                                                    <div style="font-size:16px">
                                                        <strong><a class="link link-success text-inverse" href="/category/${item.Slug}">${item.Title}</a></strong>
                                                    </div>
                                                    <div class="text-xs text-muted">
                                                        ${item.ads.length} ads posted
                                                    </div>
                                                </div>
                                            </div>`
                })
                $('[name="categories"]').append(new_content);
                $('[name="categories"]').trigger("chosen:updated");

                $("#ads-title").html(new_content_second)

            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    function searchResult() {
        var url = getUrlParameter("ads")
        var category = getUrlParameter("categories")
        if (url != undefined) {
            $(".searchDetails").html(ufirst(url))
            var actionUrl = `${base_url}Ads?categories=${category}&Description_contains=${url}&_sort=Premuim:desc&_limit=100`
            $.ajax({
                url: actionUrl,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    var new_content = "";
                    console.log(result)
                    $.each(result, function (i, item) {
                        new_content += `
                           <div class="col-lg-4">
                            <!-- START widget-->
                            <div class="panel widget">
                                <img src="/theme/img/bg1.jpg" alt="Image" class="img-responsive">
                                <div class="panel-body">
                                    <div class="row ph-lg">
                                        <div class="pull-left">
                                            <span class="fa fa-fw fa-${item.categories.Type} main-color"></span>
                                            <span class="text-muted text-xs first-uppercase main-color">${ufirst(item.categories.Type)}</span>
                                        </div>
                                    </div>
                                    <div class="row mv-lg text-center ph-lg">
                                        <strong class="text-overflow pull-left" title="${item.Title}"> <a
                                                    class="link text-inverse link-success" href="/${item.categories.Slug}/${item.id}" style="font-size:16px;">${item.Title}</a></strong>
                                    </div>
                                    <div class="row ph-lg">
                                        <div class="pull-left">
                                            <p style="font-size:16px;height:30px; letter-spacing: 1px">${fn(item.Description, 58)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- END widget-->
                        </div>`
                    })
                    if (new_content.length > 10) {
                        $("#allSearchAds").html(new_content)
                    } else {
                        $("#allSearchAds").html(`
                            <div class="row">
                                <div class="col-md-12">
                                     <div class="panel panel-danger">
                                         <div class="panel-heading">
                                            Error
                                        </div>
                                        <div class="panel-body">
                                            Sorry no result found!
                                        </div>
                                     </div>
                                </div>
                            </div>
                        `)
                    }
                }
            })
        }
    }

    function getAds(id) {
        $.ajax({
            url: `${base_url}Ads/${id}`,
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + token
            },
            success: function (result) {

                var new_content = "";
                item = result
                if (item.categories) {
                    var category = item.categories.Title
                } else {
                    var category = "No Category"
                }
                $(".searchDetails").html(item.Title)
                $(".single-heading").html(item.Title)
                $(".postData").html(item.Description)
                if (item.Email.length > 4)
                    $("#postEmail").html(item.Email)
                else
                    $("#postEmail").parent().remove()

                if (item.Phone.length > 8)
                    $("#postPhone").html(item.Phone)
                else
                    $("#postPhone").parent().remove()

                $("#postCategoryType").html(ufirst(item.categories.Type))
                $("#postUser").html(item.user.Fullname)
            }
        })
    }

    function categoriesData(category) {
        if (category != undefined) {

            $.ajax({
                url: base_url + "categories?Slug=" + category,
                method: "GET",
                success: function (r) {
                    var id = r[0].id
                    $(".searchDetails").html(ufirst(r[0].Title))
                    var actionUrl = `${base_url}Ads?categories=${id}&_sort=Premuim:desc&_limit=100`
                    $.ajax({
                        url: actionUrl,
                        method: "GET",
                        headers: {
                            "Authorization": 'Bearer ' + token
                        },
                        success: function (result) {
                            var new_content = "";
                            $.each(result, function (i, item) {
                                new_content += `
                           <div class="col-lg-4">
                            <!-- START widget-->
                            <div class="panel widget">
                                <img src="/theme/img/bg1.jpg" alt="Image" class="img-responsive">
                                <div class="panel-body">
                                    <div class="row ph-lg">
                                        <div class="pull-left">
                                            <span class="fa fa-fw fa-${item.categories.Type} main-color"></span>
                                            <span class="text-muted text-xs first-uppercase main-color">${ufirst(item.categories.Type)}</span>
                                        </div>
                                    </div>
                                    <div class="row mv-lg text-center ph-lg">
                                        <strong class="text-overflow pull-left" title="${item.Title}"> <a
                                                    class="link text-inverse link-success" href="/${item.categories.Slug}/${item.id}" style="font-size:16px;">${item.Title}</a></strong>
                                    </div>
                                    <div class="row ph-lg">
                                        <div class="pull-left">
                                            <p style="font-size:16px;height:30px; letter-spacing: 1px">${fn(item.Description, 58)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- END widget-->
                        </div>`
                            })
                            if (new_content.length > 20) {
                                $("#categoryData").html(new_content)
                            } else {
                                $("#categoryData").html(`
                            <div class="row">
                                <div class="col-md-12">
                                     <div class="panel panel-danger">
                                         <div class="panel-heading">
                                            Error
                                        </div>
                                        <div class="panel-body">
                                            Sorry no result found!
                                        </div>
                                     </div>
                                </div>
                            </div>
                        `)
                            }
                        }
                    })
                },
                error: function (e) {
                    alert("404 Not Found")
                }
            })


        }
    }

    allCategories()
    all_ads()
    searchResult()
    function getCategoryName(a, b) {
        for(var i = 0;i < a.length;i++) {
            if(a[i].id == b) {
                var ret = {
                    Title: a[i].Title,
                    Slug: a[i].Slug
                }
                return ret
            }
        }
    }
    function premiumCount(p) {
        var premium = 0
        for(var i = 0; i < p.length; i++) {
            if(p[i].Premium)
                premium++
        }
        return premium
    }
    // Profile
    function deleteAds(id) {
        var actionUrl = `${base_url}Ads/${id}`;
        $.ajax({
            url: actionUrl,
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer ' + token
            },
            success: function (result) {
                swal("Success!!", "Ads has been deleted successfully.","success")
                window.location.replace("/profile");
            },
            error: function (error) {
                console.log(error)
                swal("Error!", "Canot connect to the server!", "error")
            }
        })
    }
    function loadProfile() {
        $.ajax({
            url: `${base_url}Users/${user}`,
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + token
            },
            success: function (result) {
                var new_item = ""
                $.each(result.ads, function (i, item) {
                    var category = getCategoryName(result.categories, item.categories)

                    new_item += `
<tr>
    <td>${i + 1 }</td>
    <td>${item.Title}</td>
    <td>${item.Premium}</td>
    <td>${category.Title}</td>
    <td><ul class="list-group"><li class="list-group-item">${item.Phone}</li><li class="list-group-item">${item.Email}</li></ul></td>
    <td>${fn(item.Description, 200)}</td>
    <td>
         <a href="/${category.Slug}/${item.id}" target="_blank">
            <i class="fa fa-eye"></i>
         </a> |
         <a onclick="return confirm('Delete entry?')" class="removeAds" data-id="${item.id}">
            <i class="fa fa-close"></i>
          </a>
     </td>
</tr>`
                })
                $(".allAdsProfile").html(result.ads.length)
                $(".premiumCountProfile").html(premiumCount(result.ads))
                $(".fullNameProfile").html(result.Fullname)
                $(".addressProfile").html(result.Address)
                $("#allAdsProfile").html(new_item)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    loadProfile()

    $(document).on("click", ".removeAds", function (e) {
        e.preventDefault()
        var id = $(this).attr('data-id');
        deleteAds(id);
    })

    var url = $(location).attr('href');
    var segments = url.split('/');
    console.log(segments[3])

    if (segments[3] == "category" && segments[4] != undefined) {
        categoriesData(segments[4])
    }
    if (segments[3] != undefined && segments[4] != undefined) {
        getAds(segments[4])
    }
    $(".search").click(function () {
        var categories = $("[name='categories']").val()
        var ads = $("[name='ads']").val()
        window.location.href = "/search?categories=" + categories + "&ads=" + ads;
    })
})