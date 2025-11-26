exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).send({
    message: err.message || "Error interno del servidor",
  });
};
