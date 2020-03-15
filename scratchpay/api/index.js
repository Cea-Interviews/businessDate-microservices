const express = require('express')
const apiServer = express()

apiServer.listen (8000, () => {
    console.log("Business date api service running on port 8000")
})
module.exports = apiServer