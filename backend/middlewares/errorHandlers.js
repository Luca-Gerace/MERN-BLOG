// 400 - BAD REQUEST
export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    res.status(400).json({
      error: "NOT VALID REQUEST",
      message: err.message, 
    });
  } else {
    next(err);
  }
};

// 401 - UNAUTHORIZED
export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication needed",
    });
  } else {
    next(err);
  }
};

// 404 - NOT FOUND - Richieste a risorse non esistenti
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "RESOURCE NOT FOUND",
    message: "Resource not found",
  });
};

// 500 - INTERNAL SERVER ERROR
export const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "INTERNAL SERVER ERROR",
    message: "Generic Error",
  });
};
