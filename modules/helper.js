module.exports = {
    loadAdmin: function(res, file, data = {}) {
        res.render(file, {
            data: data,
            helper: require('./viewhelper'),
            layout: "admin/site/index"
        })
    },
    loadIndex: function(res, file, data = {}) {
        res.render(file, {
            data: data,
            layout: "frontend/layout/index"
        })
    },
    loadAdminLogin: function(res, file, data = {}) {
        res.render(file, {
            data: data,
            layout: "admin/site/login"
        })
    },
    loadLogin: function(res, file, data = {}) {
        res.render(file, {
            data: data,
            layout: "frontend/layout/login"
        })
    }
}