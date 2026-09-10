const jwt = require("jsonwebtoken");

const generateToken = async (req, res) => {
  try {
    const payload = req.payload;

    const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, { expiresIn: "7d" });

    res.status(200).send({
      status: "Success",
      data: { accessToken, refreshToken },
    });

  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = { generateToken };