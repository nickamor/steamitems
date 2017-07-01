
"use strict";

var express = require('express');
var router = express.Router();

router.get('/assets.html', function (req, res, next) {
  res.render('partials/assets');
});

router.get('/asset.html', function (req, res, next) {
  res.render('partials/asset');
});

module.exports = router;
