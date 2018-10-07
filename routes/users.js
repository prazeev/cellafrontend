var express = require('express');
var paypal = require('paypal-rest-sdk');
var router = express.Router();
var helper = require('../modules/helper');
var viewHelper = require('../modules/viewhelper');
// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVlL8nnaiXUT6rO2HP8_5rOBujCbNNBNXgLOMiMjlqdO47O99gFfOg3al0kMw6vRfHRIDY2-tMnXBdAY', // please provide your client id here
    'client_secret': 'ELEwSakvPIF5uHGfVKUGKR1nWojBle7JOqRNYM31KU5vwRavom0CAq0u3ZlT5456kBgdrY92CmwkTAN5' // provide your client secret here
});









// success page
router.get('/premium/success' , (req,res, next ) => {
    console.log(req.query);
    var paypal_res = req.query
    if(paypal_res) {
        req.session.status = "success"
        req.session.notification = "Payment for post is completed. 3$ is deducted from your account."
        res.redirect('/users/profile');
    } else {
        res.send("404 Not Found")
    }
})

// error page
router.get('/premium/err' , (req, res, next) => {
    req.session.status = "error"
    req.session.notification = "Payment cannot be completed."
    res.redirect('/users/profile');
})

router.get('/premium/post/:id', function (req, res, next) {
    var host = req.headers.host
    req.session.premium_post = req.params.id
    var payment = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://" +host + "/users/premium/success",
            "cancel_url": "http://" +host + "/users/premium/err"
        },
        "transactions": [{
            "amount": {
                "total": 3,
                "currency": "USD"
            },
            "description": "Premium Post Purchase for " + host
        }]
    }

    // call the create Pay method
    createPay(payment)
        .then((transaction) => {
        var id = transaction.id;
        var links = transaction.links;
        var counter = links.length;
        while (counter--) {
            if (links[counter].method == 'REDIRECT') {
                // redirect to paypal where user approves the transaction
                return res.redirect(links[counter].href)
            }
        }
    }).catch((err) => {
        console.log(err);
        res.redirect("http://"+host+'/users/premium/err');
    })
    // res.send(payment)
})
// helper functions
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
            if ( err ) {
                reject(err);
            }
            else {
                resolve(payment);
            }
        });
    });
}
module.exports = router;
