var express = require("express");
var router = express.Router();

var sql = require("../database/sql");

/* GET home page. */
const sectionIcons = ["🍚", "🍿", "🍜", "🍣", "🥩", "☕", "🍰"];

const statusKorMap = {
  OPN: "영업중",
  CLS: "폐업",
  VCT: "휴가중",
  RMD: "리모델링",
};

router.get("/", async function (req, res, next) {
  const sections = await sql.getSections();
  sections.map((item) => {
    item.icon = sectionIcons[item.section_id - 1];
  });

  res.render("sections", {
    title: "섹션 목록",
    sections,
  });
});

router.get("/biz-simple", async function (req, res, next) {
  const businesses = await sql.getBusinessesJoined(req.query);
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status];
    return item;
  });

  res.render("biz-simple", {
    title: "단순 식당 목록",
    businesses,
  });
});

router.get("/biz-adv", async function (req, res, next) {
  const businesses = await sql.getBusinessesJoined(req.query);
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status];
    return item;
  });

  res.render("biz-adv", {
    title: "고급 식당 목록",
    q: req.query,
    businesses,
  });

  router.get("/business/:id", async function (req, res, next) {
    const biz = await sql.getSingleBusinessJoined(req.params.id);
    biz.status_kor = statusKorMap[biz.status];
    biz.icon = sectionIcons[biz.section_id - 1];

    const menus = await sql.getMenusOfBusiness(req.params.id);
    const ratings = await sql.getRatingsOfBusiness(req.params.id);

    res.render("detail", {
      biz,
      menus,
      ratings,
    });
  });

  router.put("/menus/:id", async function (req, res, next) {
    const result = await sql.updateMenuLikes(req.params.id, req.body.like);
    res.send(result);
  });

  router.post("/ratings", async function (req, res, next) {
    const result = await sql.addRating(
      req.body.business_id,
      req.body.stars,
      req.body.comment
    );
    res.send(result);
  });

  router.delete("/ratings/:id", async function (req, res, next) {
    const result = await sql.removeRating(req.params.id);
    res.send(result);
  });
});

module.exports = router;
