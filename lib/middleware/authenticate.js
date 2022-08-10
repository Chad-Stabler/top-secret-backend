module.exports = async (req, res, next) => {
  try {
    if (!req.user) throw new Error('You are not signed in');

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
