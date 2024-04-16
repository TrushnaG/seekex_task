const db = require("../models");
const { methods: commonServices } = require("./common");
const options = require("../config/options")
const message = require("../controller/message")
const Op = db.Sequelize.Op;

const Bucket = db.buckets;
const Ball = db.balls;

const methods = {
    bucketNameExist: async (req, res, next) => {
        const bucketData = await commonServices.checkFlag(Bucket, { where: { name: req.body.name } })
        if (bucketData != 0) {
            return res.status(200).json({
                success: options.API_STATUS.FAILED,
                message: message.EXIST_DATA("Bucket name")
            })
        }
        next();
    },
    ballNameExist: async (req, res, next) => {
        const ballData = await commonServices.checkFlag(Ball, { where: { name: req.body.name } })
        if (ballData != 0) {
            return res.status(200).json({
                success: options.API_STATUS.FAILED,
                message: message.EXIST_DATA("Ball name")
            })
        }
        next();
    }
}

module.exports = { methods }