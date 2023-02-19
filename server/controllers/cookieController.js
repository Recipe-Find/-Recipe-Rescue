const cookieController = {};

//Middleware to create cookie with name SSID and value as user.id
//Note: .id give the id# || ._id give the Object ID
cookieController.setSSIDCookie = (req, res, next) => {
  console.log('Setting SSID cookie with value', res.locals.user.id);
  res.cookie('ssid', res.locals.user.id, { httpOnly: true });
  return next();
};

module.exports = cookieController;
