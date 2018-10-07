var express = require('express');
var router = express.Router();
var helper = require('../modules/helper');
var viewHelper = require('../modules/viewhelper');

router.use(function(req, res, next) {
    if(req.cookies.token) {
        res.locals.user = "logged in";
    }
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    helper.loadIndex(res, 'frontend/site/index', {
        title: "Home | Adifier"
    })
});

/* GET users listing. */
router.get('/login', function (req, res, next) {
    helper.loadLogin(res, 'frontend/site/login', {
        title: "Login to Cella!!"
    })
});

router.get('/profile', function (req, res, next) {
    helper.loadIndex(res, 'frontend/page/profile', {
        title: "Profile | Adifier"
    })
});
router.get('/category/:id', function(req, res, next) {
    helper.loadIndex(res, 'frontend/site/category', {
        title: "Single Page"
    })
})

router.get('/search', function(req, res, next) {
    helper.loadIndex(res, 'frontend/site/search', {
        title: "Search Page"
    })
})

router.get("/:categories/:post", function(req, res, next) {
    helper.loadIndex(res, 'frontend/site/single', {
        title: "Single Page"
    })
})

module.exports = router;
