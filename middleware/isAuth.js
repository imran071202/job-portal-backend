import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const authToken = req.cookies.token;

    if (!authToken) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(authToken, process.env.SECRET_KEY);

    req._id = decode.userID; // Add user ID to request for later use
    next();
  } catch (error) {
    console.error("Auth Error:", error.message); // Log for debugging
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
      success: false,
    });
  }
};

export default isAuth;
