const db = require("../models");
const _ = require("lodash");
const { methods: commonServices } = require("../services/common");
const { methods: contentService } = require("../services/content");
const commonConfig = require("../config/common.config");
const message = require("./message");
const options = require("../config/options");
const Op = db.Sequelize.Op;

const Bucket = db.buckets;
const Ball = db.balls;
const BucketBall = db.bucket_balls;

// Create New Bucket
exports.createBucket = async (req, res) => {
  try {
    const bucketData = await commonServices.create(Bucket, {
      name: req.body.name,
      capacity: req.body.capacity
    })
    if (!bucketData) {
      return res.status(200).json({ success: options.API_STATUS.FAILED, message: message.NO_ADD("Bucket") })
    }
    await Bucket.update({ currentVolume: 0 }, { where: {} });
    await BucketBall.destroy({ where: {} });
    return res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.ADD_DATA("Bucket"), data: bucketData })
  } catch (error) { res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message }) }
};

// Create New Ball
exports.createBall = async (req, res) => {
  try {
    const ballData = await commonServices.create(Ball, {
      name: req.body.name,
      size: req.body.size
    })
    if (!ballData) {
      return res.status(200).json({ success: options.API_STATUS.FAILED, message: message.NO_ADD("Ball") })
    }

    //update current volume when new bucket add
    await Bucket.update({ currentVolume: 0 }, { where: {} });

    //delete the bucket ball relation
    await BucketBall.destroy({ where: {} });
    return res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.ADD_DATA("Ball"), data: ballData })
  } catch (error) { res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message }) }
};

// place ball in bucket
exports.placeBallsInBuckets = async (req, res) => {
  try {
    const ballsToPlace = req.body.ballArray;
    // Get all buckets sorted by currentVolume in descending order
    const allBuckets = await commonServices.rawQuery(Bucket, { order: [['currentVolume', 'DESC']] });
    if (allBuckets.length == 0) {
      return res.status(200).json({
        success: options.API_STATUS.FAILED,
        message: message.NO_DATA("Bucket list")
      })
    }
    //Get all balls sorted by size in ascending order
    const allBalls = await commonServices.rawQuery(Ball,
      { where: { id: ballsToPlace.map(item => item.ball_id) }, order: [['size', 'ASC']] })

    if (allBalls.length == 0) {
      return res.status(200).json({
        success: options.API_STATUS.FAILED,
        message: message.NO_DATA("Ball list")
      })
    }
    // Generate array of balls with size, name, and quantity
    const newArray = _.flatMap(ballsToPlace, ({ ball_id, quantity }) => {
      const ball = allBalls.find(b => b.id === ball_id);
      return _.times(quantity, () => ({ ball_id, size: ball.size, name: ball.name }));
    });

    let bucketBallMap = new Map()
    let startIndex = 0;
    let endIndex = 0;

    for (let bucket of allBuckets) {
      let sum = 0;
      // Iterate through the array
      for (let i = startIndex; i < newArray.length; i++) {
        sum += newArray[i].size;

        // Check if the sum meets the condition
        if (sum <= (bucket.capacity - bucket.currentVolume)) {
          endIndex = i + 1;
        }

      }
      bucketBallMap.set(bucket, newArray.slice(startIndex, endIndex))
      startIndex = endIndex;
    }

    for (let bucket of allBuckets) {
      // get balls from bucketBall map
      const ballData = `${JSON.stringify(bucketBallMap.get(bucket))}`
      const modifyResponse = { bucket: JSON.parse(JSON.stringify(bucket)), balls: JSON.parse(ballData) }

      // change modifyResponse to add in Database
      let bucketBallRelationData = modifyResponse.balls.reduce((acc, ball) => {
        const index = acc.findIndex(item => item.ballId === ball.ball_id);
        if (index === -1) {
          acc.push({ bucketId: modifyResponse.bucket.id, ballId: ball.ball_id, quantity: 1 });
          bucket.currentVolume += ball.size
        } else {
          acc[index].quantity++;
          bucket.currentVolume += ball.size

        }
        return acc;
      }, []);

      try {
        for (let data of bucketBallRelationData) {
          const bucketBall = await commonServices.get(BucketBall, {
            where: {
              bucketId: data.bucketId,
              ballId: data.ballId
            }
          })
          if (bucketBall) {
            bucketBall.quantity += data.quantity;
            await bucketBall.save();
            bucket.save()
          } else {
            await BucketBall.create(data);
            bucket.save()
          }
        }

      } catch (error) {
        res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message })
      }
    }
    const reminingBall = newArray.length - endIndex;
    if (reminingBall != 0) {
      return res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.NO_SPACE_INBUCKET(`${reminingBall}`), data: { reminingBall: newArray.length - endIndex } })
    } else {
      return res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.PLACE_BALL_SUCCESS, data: { placeBall: endIndex } })
    }
  } catch (error) {
    res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message })
  }
}

// suggestion bucket
exports.suggestionBucket = async (req, res) => {
  try {
    const ballsToPlace = req.body.ballArray;
    // Get all buckets sorted by currentVolume in descending order
    const allBuckets = await commonServices.rawQuery(Bucket, { order: [['currentVolume', 'DESC']] });
    if (allBuckets.length == 0) {
      return res.status(200).json({
        success: options.API_STATUS.FAILED,
        message: message.NO_DATA("Bucket list")
      })
    }
    //Get all balls sorted by size in ascending order
    const allBalls = await commonServices.rawQuery(Ball,
      { where: { id: ballsToPlace.map(item => item.ball_id) }, order: [['size', 'ASC']] })
    if (allBalls.length == 0) {
      return res.status(200).json({
        success: options.API_STATUS.FAILED,
        message: message.NO_DATA("Ball list")
      })
    }
    // Generate array of balls with size, name, and quantity
    const newArray = _.flatMap(ballsToPlace, ({ ball_id, quantity }) => {
      const ball = allBalls.find(b => b.id === ball_id);
      return _.times(quantity, () => ({ ball_id, size: ball.size, name: ball.name }));
    });

    let bucketBallMap = new Map()
    let startIndex = 0;
    let endIndex = 0;
    let suggetBucket = 0

    for (let bucket of allBuckets) {
      let sum = 0;
      // Iterate through the array
      for (let i = startIndex; i < newArray.length; i++) {
        sum += newArray[i].size;

        // Check if the sum meets the condition
        if (sum <= (bucket.capacity - bucket.currentVolume)) {
          endIndex = i + 1;
        }

      }
      bucketBallMap.set(bucket, newArray.slice(startIndex, endIndex))
      startIndex = endIndex;

      var ballData = `${JSON.stringify(bucketBallMap.get(bucket))}`
      if (JSON.parse(ballData).length != 0) {
        suggetBucket += 1
      }
    }

    return res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.GET_DATA("Minimum number of bucket"), data: { suggetBucket: suggetBucket } })

  } catch (error) {
    res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message })
  }
}

// get bucket list
exports.getAllBucketList = async (req, res) => {
  try {
    const { s } = req.query
    let DataObj = {};
    // seraching by bucket name
    if (s) {
      DataObj = {
        ...DataObj,
        [Op.or]: [
          { name: { [Op.like]: `%${s}%` } }
        ]
      }
    }

    let query = {
      where: { ...DataObj },
      attributes: ['id', 'name', 'capacity'],
      include: [{ model: Ball, through: { attributes: ['quantity'] } }]
    };

    let data = await commonServices.rawQuery(Bucket, query)
    let responseData = JSON.parse(JSON.stringify(data))
    if (responseData.length != 0) {
      res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.GET_DATA("Bucket list"), data: responseData })
    } else {
      res.status(200).json({ success: options.API_STATUS.FAILED, message: message.NO_DATA("Bucket list") })
    }
  } catch (error) {
    res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message })
  }
};

// get ball list
exports.getAllBallList = async (req, res) => {
  try {
    let query = {
      attributes: ['id', 'name', 'size'],
    };

    let data = await commonServices.rawQuery(Ball, query)
    let responseData = JSON.parse(JSON.stringify(data))
    if (responseData.length != 0) {
      res.status(200).json({ success: options.API_STATUS.SUCCESS, message: message.GET_DATA("Ball list"), data: responseData })
    } else {
      res.status(200).json({ success: options.API_STATUS.FAILED, message: message.NO_DATA("Ball list") })
    }
  } catch (error) {
    res.status(200).json({ success: options.API_STATUS.FAILED, message: error.message })
  }
};
