const bucketController = require("../../controller/bucket.controller");
const {methods: contentService} = require("../../services/content")

module.exports = async function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/bucket", contentService.bucketNameExist, bucketController.createBucket);
  app.post("/api/ball", contentService.ballNameExist, bucketController.createBall);
  app.post("/api/placeball", bucketController.placeBallsInBuckets);
  app.post("/api/suggestbucket", bucketController.suggestionBucket);
  app.get("/api/bucketlist", bucketController.getAllBucketList);
  app.get("/api/balllist", bucketController.getAllBallList);
};