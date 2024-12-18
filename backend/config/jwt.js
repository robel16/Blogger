module.exports = {
  secret: process.env.JWT_SECRET || "123456789",
  expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  algorithm: "HS256",
};
