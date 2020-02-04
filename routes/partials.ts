import express from "express";

const router = express.Router();

router.get("/assets.html", function(_, res) {
  res.render("partials/assets");
});

router.get("/asset.html", function(_, res) {
  res.render("partials/asset");
});

export default router;
