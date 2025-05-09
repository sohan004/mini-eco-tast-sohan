const router = require("express").Router();
const {
    getCustomerList
} = require("../controller/customer.controller");

const authMiddleware = require("../middleware/authMIddleware");

router.get("/customer-list", getCustomerList);

module.exports = router;
