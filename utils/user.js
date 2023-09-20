import mongoose from "mongoose";
import UserModel from "../models/user.model.js";

let ObjectId = mongoose.Types.ObjectId;

// Get user details by user id
export const getUserById = async function(userId) {

    let response = {requestStatus: "", statusCode: 0, errMsg: ""}

    if (!mongoose.isValidObjectId(userId)) {
        response.requestStatus = "RJCT"
        response.statusCode = 400
        response.errMsg = "User ID is not valid"
        return response
    } else {
        let user = await UserModel.findOne({ _id: new ObjectId(userId)}).exec();
        if (user !== null) {
            response.requestStatus = "ACTC"
            response.userDetails = user
            return response
        } else {
            response.requestStatus = "RJCT"
            response.statusCode = 404
            response.errMsg = "User is not found"
            return response
        }
    }

}

// Get user details by username (case-insensitive)
export const getUserByUsername = async function(userName) {

    let response = {requestStatus: "", statusCode: 0, errMsg: ""}

    if (!userName || userName.trim() === "") {
        response.requestStatus = "RJCT"
        response.statusCode = 400
        response.errMsg = "Username is required"
        return response
    } else {
        let user = await UserModel.findOne({ userName: new RegExp(`^${userName}$`, "i") }).exec();
        if (user !== null) {
            response.requestStatus = "ACTC"
            response.userDetails = user
            return response
        } else {
            response.requestStatus = "RJCT"
            response.statusCode = 404
            response.errMsg = "User is not found"
            return response
        }
    }

}