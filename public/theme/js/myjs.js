/**
 * @Author: Bashudev Poudel <prazeev>
 * @Date:   2018-09-30T13:25:54+05:45
 * @Email:  prazeev@gmail.com
 * @Filename: myjs.js
 * @Last modified by:   prazeev
 * @Last modified time: 2018-09-30T21:00:55+05:45
 * @Copyright: Copyright 2018, Bashudev Poudel
 */



// CHART LINE
// -----------------------------------
(function (window, document, $, undefined) {
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

    function fn(text, count = 200) {
        return text.slice(0, count) + (text.length > count ? "..." : "");
    }
    function dateToYMD(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }
    var base_url = `http://139.59.6.47:1337/`
    var token = readCookie("token");
    var user = readCookie("userId");
    $(window).load(function () {
        function loadAds(limit = 2) {
            $.ajax({
                url: `${base_url}Ads?_limit=${limit}&_sort=createdAt:desc`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    var new_content = "";
                    $.each(result, function (i, item) {
                        if (item.Premium) {
                            var item_type = {
                                premium: true,
                                text: "Premium",
                                icon: 'P',
                                t_class: "success"
                            }
                        } else {
                            var item_type = {
                                premium: false,
                                text: "Free",
                                icon: 'F',
                                t_class: "info"
                            }
                        }
                        new_content += `<li class="list-group-item">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="panel widget">
                                        <div class="panel-body bg-${item_type.t_class} text-center">
                                            <div class="text-lg m0">${item_type.icon}</div>
                                            <div class="mb-lg"></div>
                                            <i>${item_type.text}</i>
                                         </div>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <div class="panel-title">
                                        ${item.Title} - <i>${item.user.Fullname}</i>
                                    </div>
                                    <div class="panel-description">` + fn(item.Description) + `</div>
                                    <div class="pull-right">
                                        <div class="btn-group">
                                            <a href="javascript:void();" data-details="${item.Description}" data-title="${item.Title}" data-author="${item.user.Fullname}" class="btn btn-danger viewModel">
                                                <i class="fa fa-eye"></i> View
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>`
                    })
                    $("#latestAds").html(new_content);
                },
                error: function () {
                    alert("Error")
                }
            })
        }

        function countPremiumAds() {
            $.ajax({
                url: `${base_url}Ads/Count?Premium=true`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    $("#premiumAds").html(result);
                },
                error: function (result) {
                    $("#premiumAds").html("0");
                }
            })
        }

        function countCategories() {
            $.ajax({
                url: `${base_url}Categories/Count?Status=true`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    $("#totalCategories").html(result);
                },
                error: function (result) {
                    $("#totalCategories").html("0");
                }
            })
        }

        function countTotalAds() {
            $.ajax({
                url: `${base_url}Ads/Count`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    $("#totalAds").html(result);
                },
                error: function (result) {
                    $("#totalAds").html("0");
                }
            })
        }

        // Add Categories Page
        function create_categories() {
            $(".create_categories").submit(function (e) {
                e.preventDefault();
                $("#categoriesSubmit").prop("disabled", true)
                var actionurl = `${base_url}Categories/`;
                var data = {
                    Title: $("[name=title]").val(),
                    Slug: $("[name=slug]").val(),
                    Description: $("[name=description]").val(),
                    Status: true,
                    user: user
                }
                $.ajax({
                    url: actionurl,
                    method: 'POST',
                    headers: {
                        "Authorization": 'Bearer ' + token
                    },
                    data: data,
                    success: function (output) {
                        $("#categoriesSubmit").prop("disabled", false)
                        swal("Success!", "New Category is created!", "success");
                        window.location.replace("/admin/categories");
                    },
                    error: function (error) {
                        $("#categoriesSubmit").prop("disabled", false)
                        console.log(error)
                        swal("Error!", "Cannot send request to server!", "error")
                    }
                })
            })
        }

        function updateCategories(id, data) {
            $("[name=title]").val(data.title)
            $("[name=slug]").val(data.slug)
            $("[name=description]").val(data.description)
            $(".update_categories").submit(function (e) {
                e.preventDefault();
                $("#categoriesSubmit").prop("disabled", true)
                var actionurl = `${base_url}Categories/${id}`;
                var data = {
                    Title: $("[name=title]").val(),
                    Slug: $("[name=slug]").val(),
                    Description: $("[name=description]").val(),
                    Status: true,
                }
                $.ajax({
                    url: actionurl,
                    method: 'PUT',
                    headers: {
                        "Authorization": 'Bearer ' + token
                    },
                    data: data,
                    success: function (output) {
                        $("#categoriesSubmit").prop("disabled", false)
                        swal("Success!", "Category is updated!", "success");
                        window.location.replace("/admin/categories");
                    },
                    error: function (error) {
                        $("#categoriesSubmit").prop("disabled", false)
                        console.log(error)
                        swal("Error!", "Cannot send request to server!", "error")
                    }
                })
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
                    $.each(result, function (i, item) {
                        new_content += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.Title}</td>
                            <td>${item.Slug}</td>
                            <td>${fn(item.Description, 200)}</td>
                            <td>${item.user.email}</td>
                            <td>
                                <a href="javascript:void();" class="editCategories" data-title="${item.Title}" data-description="${item.Description}" data-slug="${item.Slug}" data-id="${item.id}">
                                    <i class="fa fa-edit"></i>
                                </a> | <a href="delete" class="deleteCategories" onclick="return confirm('Delete entry?')" data-id="${item.id}">
                                    <i class="fa fa-close"></i>
                                </a>
                            </td>
                        </tr>`
                    })
                    $("#allCategories").html(new_content)
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }

        function deleteCategories(id) {
            var actionUrl = `${base_url}Categories/${id}`;
            console.log(id)
            $.ajax({
                url: actionUrl,
                method: "DELETE",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    swal("Success!!", "Category has been deleted successfully.")
                    window.location.replace("/admin/categories");
                },
                error: function (error) {
                    console.log(error)
                    swal("Error!", "Canot connect to the server!", "error")
                }
            })
        }

        // Ads page
        function all_ads() {
            $.ajax({
                url: `${base_url}Ads?_sort=createdAt:desc`,
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
                        new_content += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.Title}</td>
                            <td>${item.Premium}</td>
                            <td>${category}</td>
                            <td><ul class="list-group"><li class="list-group-item">${item.Phone}</li><li class="list-group-item">${item.Email}</li></ul></td>
                            <td>${fn(item.Description, 200)}</td>
                            <td>${item.user.email} (${item.user.Fullname})</td>
                            <td>
                                 <a href="delete" class="viewAds" data-id="${item.id}">
                                    <i class="fa fa-eye"></i>
                                </a> |
                                <a href="delete" class="deleteAds" onclick="return confirm('Delete entry?')" data-id="${item.id}">
                                    <i class="fa fa-close"></i>
                                </a>
                            </td>
                        </tr>`
                    })
                    $("#allAds").html(new_content)
                }
            })
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
                    new_content += `
                            <li class="list-group-item">Title: ${item.Title}</li>
                            <li class="list-group-item">Description: ${item.Description}</li>
                            <li class="list-group-item">Phone: ${item.Phone}</li>
                            <li class="list-group-item">Email: ${item.Email}</li>
                            <li class="list-group-item">Premium: ${item.Premium}</li>
                            <li class="list-group-item">Expireson: `+item.Expireson+`</li>
                            <li class="list-group-item">Status: ${item.Status}</li>
                            <li class="list-group-item">Categories: ${category}</li>
                            <li class="list-group-item">User: ${item.user.Fullname} (${item.user.email})</li>
                        `
                    $(".modal-body").html(new_content)
                    $(".modal-title").html(item.Title)
                }
            })
        }
        function deleteAds(id) {
            var actionUrl = `${base_url}Ads/${id}`;
            console.log(id)
            $.ajax({
                url: actionUrl,
                method: "DELETE",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    swal("Success!!", "Ads has been deleted successfully.")
                    window.location.replace("/admin/ads");
                },
                error: function (error) {
                    console.log(error)
                    swal("Error!", "Canot connect to the server!", "error")
                }
            })
        }
        // users
        function allUsers() {
            $.ajax({
                url: `${base_url}Users?_sort=createdAt:desc`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    var new_content = "";
                    $.each(result, function (i, item) {
                        new_content += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.username}</td>
                            <td>${item.email}</td>
                            <td>${item.role.name}</td>
                            <td>${item.Fullname}</td>
                            <td>${item.Address}</td>
                            <td>
                                 <a href="delete" class="viewUser" data-id="${item.id}">
                                    <i class="fa fa-eye"></i>
                                </a> |
                                <a href="delete" class="deleteUser" onclick="return confirm('Delete entry?')" data-id="${item.id}">
                                    <i class="fa fa-close"></i>
                                </a>
                            </td>
                        </tr>`
                    })
                    $("#allUsers").html(new_content)
                }
            })
        }
        function deleteUser(id) {
            var actionUrl = `${base_url}Users/${id}`;
            $.ajax({
                url: actionUrl,
                method: "DELETE",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    swal("Success!!", "User has been deleted successfully.")
                    window.location.replace("/admin/users");
                },
                error: function (error) {
                    console.log(error)
                    swal("Error!", "Canot connect to the server!", "error")
                }
            })
        }
        function getUser(id) {
            $.ajax({
                url: `${base_url}Users/${id}`,
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + token
                },
                success: function (result) {
                    var new_content = "";
                    var ads = `<table class="table"><thead><tr><th>ID</th><th>Title</th><th>Premium</th></tr></thead><tbody>`;
                    item = result
                    $.each(item.ads, function(i, a) {
                        ads += `<tr><td>${i + 1}</td><td>${a.Title}</td><td>${a.Premium}</td></tr>`
                    })
                    ads += `</tbody></table>`
                    new_content += `
                            <li class="list-group-item">Fullname: ${item.Fullname}</li>
                            <li class="list-group-item">Confirmed: ${item.confirmed}</li>
                            <li class="list-group-item">Blocked: ${item.blocked}</li>
                            <li class="list-group-item">Username: ${item.username}</li>
                            <li class="list-group-item">Email: ${item.email}</li>
                            <li class="list-group-item">Role: ${item.role.name}</li>
                            <li class="list-group-item">Address: ${item.Address}</li>
                            <li class="list-group-item">Gender: ${item.Gender}</li>
                            <li class="list-group-item">Ads: ${ads}</li>
                        `
                    $(".modal-body").html(new_content)
                    $(".modal-title").html(item.Fullname)
                }
            })
        }
        loadAds()
        countPremiumAds()
        countCategories()
        countTotalAds()
        create_categories()
        allCategories()
        // all ads
        all_ads()
        $(document).on("click", ".viewAds", function (e) {
            e.preventDefault();
            var id = $(this).attr("data-id")
            getAds(id)
            $('#viewModal').modal('show');
        })
        $(document).on("click", ".deleteAds", function (e) {
            e.preventDefault()
            var id = $(this).attr('data-id');
            deleteAds(id);
        })
        // Users
        allUsers()
        $(document).on("click", ".deleteUser", function (e) {
            e.preventDefault()
            var id = $(this).attr('data-id');
            deleteUser(id);
        })
        $(document).on("click", ".viewUser", function (e) {
            e.preventDefault();
            var id = $(this).attr("data-id")
            getUser(id)
            $('#viewModal').modal('show');
        })

        $(document).on("click", ".deleteCategories", function (e) {
            e.preventDefault()
            var id = $(this).attr('data-id');
            deleteCategories(id);
        })
        $(document).on("click", ".editCategories", function (e) {
            e.preventDefault()
            var data = {
                title: $(this).attr("data-title"),
                slug: $(this).attr("data-slug"),
                description: $(this).attr("data-description")
            }
            var category_id = $(this).attr('data-id');
            $('#editModal').modal('show');
            updateCategories(category_id, data);
        })
        $(document).on("click", ".viewModel", function (e) {
            e.preventDefault();
            var title = $(this).attr("data-title")
            var description = $(this).attr("data-details")
            var author = $(this).attr("data-author")
            $('.modal-title').html(title + " <b>-" + author + "</b>")
            $(".modal-body p").html(description)
            $('#viewModal').modal('show');
        })
    });
})(window, document, window.jQuery);
