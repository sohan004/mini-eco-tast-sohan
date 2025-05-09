const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");

module.exports.getCustomerList = asyncErrorCatcher(async (req, res) => {
  const customer = await db.$queryRaw`
    SELECT
    u.*,
    COUNT(o.id) AS orderCount
    FROM User u
    LEFT JOIN \`Order\` o ON u.id = o.userId
    GROUP BY u.id
    ORDER BY orderCount DESC
    `;


  res.json({
    status: true,
    message: "Customer fetched successfully",
    data: customer,
  });
});
