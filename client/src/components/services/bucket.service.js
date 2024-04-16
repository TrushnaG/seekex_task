import axios from "axios";

const API_URL = "http://localhost:8080";

const createNewBucket = (bucketData) => {
  return axios.post(API_URL + "/api/bucket", bucketData);
};

const createNewBall = (ballData) => {
  return axios.post(API_URL + "/api/ball", ballData);
};

const getBallList = () => {
  return axios.get(API_URL + "/api/balllist");
};

const getSuggestBucket =async (ballArray) => {
  try {
    const response = await axios.post(API_URL + "/api/suggestbucket", {ballArray});
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to get suggest buckets.');
  }
};

const placeBall = async (ballArray) => {
  try {
    const response = await axios.post(API_URL + "/api/placeball", { ballArray });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to place balls in buckets.');
  }
};

const getBucketList = () => {
  return axios.get(API_URL + "/api/bucketlist");
};


const BucketService = {
  createNewBucket,
  createNewBall,
  getBallList,
  getSuggestBucket,
  placeBall,
  getBucketList
}

export default BucketService;