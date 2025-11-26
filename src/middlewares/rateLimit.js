const rateLimit = {};

exports.apiRateLimiter = (limit = 20, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;

    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, firstRequest: Date.now() };
    } else {
      rateLimit[ip].count++;
    }

    const timePassed = Date.now() - rateLimit[ip].firstRequest;

    if (timePassed > windowMs) {
      rateLimit[ip].count = 1;
      rateLimit[ip].firstRequest = Date.now();
    }

    if (rateLimit[ip].count > limit) {
      return res
        .status(429)
        .send({ message: "Demasiadas solicitudes, intenta más tarde" });
    }

    next();
  };
};
