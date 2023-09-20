const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const { leagueValidation } = require('../utils/leaguesModule.js');

dotenv.config();
const port = process.env.PORT || 8000;
const url = `http://localhost:${port}`

describe('Test task 1 functions', function () {

    // beforeAll(async () => {
    //     dotenv.config();
    //     await mongoose.connect(process.env.DEV_DB);
    // });

    test('Registration - userName is not defined', async () => {
        //const reqBody = { userName1: "", password: "" };
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: { userName1: "", password: "" },
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - userName is empty', async () => {
        //const reqBody = { userName: "", password: "" };
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: { userName: "", password: "" },
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    // ADD CLOSE CONNECTION

});

