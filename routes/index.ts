import express from "express";

const router = express.Router();

/* GET home page. */
router.get(["/", "/asset/:assetId"], function(_, res) {
  res.render("index");
});

export default router;
