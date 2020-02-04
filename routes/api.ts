import express from "express";
import request from "request";

const router = express.Router();

const host = "http://steamcommunity.com";

router.get("/assets", function(req, res) {
  const options = {
    method: "GET",
    url: host + "/inventory/76561197991677902/753/6",
    qs: {
      l: "english",
      count: "100",
      start_assetid: undefined
    }
  };

  if (typeof req.query.start_assetid !== "undefined") {
    options.qs.start_assetid = req.query.start_assetid;
  }

  if (typeof req.query.count !== "undefined") {
    options.qs.count = req.query.count;
  }

  request(options, (error, _, body) => {
    if (error) {
        throw new Error(error);
    }

    res.type("json");
    res.send(body);
  });
});

router.get("/orders/:item_nameid", function(req, res) {
  request(
    {
      method: "GET",
      url: host + "/market/itemordershistogram",
      qs: {
        language: "english",
        currency: "1",
        item_nameid: req.params.item_nameid
      }
    },
    (error, _, body) => {
      if (error) {
        throw new Error(error);
      }

      res.type("json");
      res.send(body);
    }
  );
});

router.get("/item_nameid/:market_hash_name", function(req, res) {
  request(
    {
      method: "GET",
      url: host + "/market/listings/753/" + req.params.market_hash_name
    },
    (error, _, body) => {
      if (error) {
          throw new Error(error);
      }

      const item_nameid = parseInt(
        body.match(/Market_LoadOrderSpread\( (.+) \)/)[1]
      );

      res.send({ success: true, item_nameid: item_nameid });
    }
  );
});

export default router;
