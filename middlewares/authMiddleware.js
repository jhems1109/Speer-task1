import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const authenticate = async (req, res, next) => {

  // Reject if Authorization property is not found in request header
  if (!req.header("Authorization")) {
    res.status(404).send({ message: "Not authorized" });
    return
  }

  // Authorization property should be prefixed with "Bearer "
  let token = req.header("Authorization").replace("Bearer ", "");
  try {
    if (token && token !== null) {
      // Verify token received
      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          res.status(404).send({ message: err });
        } else {
          return data;
        }
      });
      if (decoded) {
        const user = await UserModel.findById(decoded.userId);
        req.userId = user._id;
        next();
      }
    } else {
      res.status(404).send({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).send({ message: "Invalid token!" });
  }

}

