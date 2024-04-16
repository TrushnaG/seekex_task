module.exports = {
    NO_DATA: (str) => `${str} doesn't exists!`,
    GET_DATA:(str) => `${str} has been got successfully!`,
    EXIST_DATA: (str) => `${str} already exists!`,
    NO_ADD: (str) => `${str} has not been created successfully!`,
    ADD_DATA: (str) => `${str} has been created successfully!`,
    PLACE_BALL_SUCCESS: `All ball has been placed successfully!`,
    NO_SPACE_INBUCKET:(str)=> `There is no enough space in bucket return ${str} balls to shop!`
}