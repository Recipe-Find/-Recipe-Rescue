const JWT_cookieController = {};

//Middleware to create cookie with name SSID and value as user.id
//Note: .id give the id# || ._id give the Object ID
JWT_cookieController.setSSIDCookie = (req, res, next) => {
  console.log('JWT, Setting SSID cookie with value', res.locals.serializedToken);
  res.cookie('ssid', res.locals.serializedToken, { httpOnly: true });
  return next();
};

module.exports = JWT_cookieController;
