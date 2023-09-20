import UserModel from "../models/user.model.js";
import { genHash, genSalt } from "./auth.js";

export const registerUser = async (req, res) => {

  const { userName, password, firstName, lastName } = req.body;

  // Username is mandatory
  if (!userName || userName.trim() === "") {
    res.status(400).send({ message: "Username is mandatory" });
    return
  }

  // Password is mandatory
  if (!password || password.trim() === "") {
    res.status(400).send({ message: "Password is mandatory" });
    return
  }

  // Username must be unique, reject if already in used
  const existingUsername = await UserModel.findOne({
    userName: new RegExp(`^${userName}$`, "i"),
  });
  if (existingUsername) {
    res.status(400).send({ message: "The username is not available" });
    return
  }
  
  // Check if password meets criteria
  let passwordCheck = await isValidPassword(password);
  if (!passwordCheck.valid) {
    res.status(400).send({ message: passwordCheck.errMsg });
    return
  }

  // Generate salt and hash password for more security
  const salt = genSalt();
  const hashedPassword = genHash(password, salt);

  let newUser = new UserModel({
    userName,
    password: hashedPassword,
    salt,
    firstName,
    lastName,
  })
  await newUser.save()
  .then(() => {
    res.status(201).send({ message: "Successfully registered" });
  })
  .catch((error) => {
    res.status(400).send({ message: "Registration was not successful", errMsg : error });
  })

};

const isValidPassword = async (password) => {
  
  // Parameters are temporarily hardcoded
  const minPasswordLength = 8
  const capitalLetterIsRequired = true
  const capitalLettersList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const specialCharacterIsRequired = true
  const specialCharsList = "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"
  const numberIsRequired = true
  const numbersList =  "0123456789"
  
  if (password.length < minPasswordLength) {
    return {
      valid: false,
      errMsg: `Password must be at least ${minPasswordLength} characters.`,
    };
  }
  if (capitalLetterIsRequired && !checkPasswordChar(password, capitalLettersList)) {
    return { valid: false, errMsg: `Password requires a capital letter.` };
  }
  if (specialCharacterIsRequired && !checkPasswordChar(password, specialCharsList)) {
    return { valid: false, errMsg: `Password requires a special character.` };
  }
  if (numberIsRequired && !checkPasswordChar(password, numbersList)) {
    return { valid: false, errMsg: `Password requires a numeric character.` };
  }
  return { valid: true };
};

const checkPasswordChar = (password, charsToCheck) => {
  if (password.trim() === "" || charsToCheck.trim() === "") {
    return false;
  }
  for (let i = 0; i < password.length; i++) {
    if (charsToCheck.indexOf(password.charAt(i)) != -1) {
      return true;
    }
  }
  return false;
};
