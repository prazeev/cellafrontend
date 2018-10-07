var express = require('express');
var router = express.Router();
var helper = require('../modules/helper');
var viewHelper = require('../modules/viewhelper');

/* GET home page. */
router.get('/login', function(req, res, next) {
    helper.loadAdminLogin(res, 'admin/site/login/login')
});
router.get('/', function(req, res, next) {
    helper.loadAdmin(res, 'admin/site/page/dashboard', {
        req: req,
        title: "Home | Dashboard"
    })
})
router.get('/categories', function(req, res, next) {
    helper.loadAdmin(res, "admin/site/page/all_categories", {
        req: req,
        title: "Create Categories | Dashboard"
    })
})
router.get('/categories/create_categories', function(req, res, next) {
    helper.loadAdmin(res, "admin/site/page/create_categories", {
        req: req,
        title: "Add Categories | Dashboard"
    })
})
// ads
router.get('/ads', function(req, res, next) {
    helper.loadAdmin(res, "admin/site/page/all_ads", {
        req: req,
        title: "All Ads | Dashboard"
    })
})
// users
router.get('/users', function(req, res, next) {
    helper.loadAdmin(res, "admin/site/page/all_users", {
        req: req,
        title: "All users | Dashboard"
    })
})
module.exports = router;
