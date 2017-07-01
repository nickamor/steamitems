
var express = require('express');
var router = express.Router();
var request = require("request");

var host = 'http://steamcommunity.com';

router.get('/assets', function (req, res, next) {
    var options = {
        method: 'GET',
        url: host + '/inventory/76561197991677902/753/6',
        qs: {
            l: 'english',
            count: '100'
        }
    };

    if (typeof req.query.start_assetid !== 'undefined') {
        options.qs.start_assetid = req.query.start_assetid;
    }

    if (typeof req.query.count !== 'undefined') {
        options.qs.count = req.query.count;
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.type('json');
        res.send(body);
    });
});

router.get('/orders/:item_nameid', function (req, res, next) {
    request({
        method: 'GET',
        url: host + '/market/itemordershistogram',
        qs:
        {
            language: 'english',
            currency: '1',
            item_nameid: req.params.item_nameid
        }
    }, function (error, response, body) {
        if (error) throw new Error(error);

        res.type('json');
        res.send(body);
    });
});

router.get('/item_nameid/:market_hash_name', function (req, res, next) {
    request({
        method: 'GET',
        url: host + '/market/listings/753/' + req.params.market_hash_name
    }, function (error, response, body) {
        if (error) throw new Error(error);

        var item_nameid = parseInt(body.match(/Market_LoadOrderSpread\( (.+) \)/)[1]);

        res.send({ 'success': true, 'item_nameid': item_nameid });
    });
});

module.exports = router;
