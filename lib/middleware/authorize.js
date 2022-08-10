
module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.email.includes('@defense.gov')) throw new Error('You are not authorized to view secrets');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
