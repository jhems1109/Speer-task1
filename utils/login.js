import UserModel from "../models/user.model.js";
import { genHash, generateToken } from "./auth.js";

export const login = async (req, res) => {

  const { userName, password } = req.body;

  // Username and password are mandatory
  if (!userName || !password || userName.trim() === "" || password.trim() === "") {
    res.status(400).send({ message: "Username and password are mandatory" });
    return
  }

  // Check user collection using the username (case-insensitive) input 
  let user = await UserModel.findOne({
    userName: new RegExp(`^${userName}$`, "i")
  });
  if (!user) {
    res.status(400).send({ message: "Incorrect username or password" });
    return
  }

  // Validate that the hash of password input + salt found in db is equal to hashed password in db
  const hashedPassword = genHash(password, user.salt);
  if (hashedPassword === user.password) {
    // Generate new token and respond back to client
    let token = generateToken(res, user._id);
    res.status(202).send({
      message: "Successfully logged-in",
      userId: user._id,
      token,
    });
  } else {
    res.status(400).send({ message: "Incorrect username or password" });
    return
  }

};