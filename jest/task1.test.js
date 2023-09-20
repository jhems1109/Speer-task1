const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 8000;
const url = `http://localhost:${port}`

describe('Test task 1 functions', function () {

    test('Registration - userName is not defined', async () => {
        let data = { userName1: "123", password: "123" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - userName is empty', async () => {
        let data = { userName: "", password: "123" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - password is not defined', async () => {
        let data = { userName: "user1", password1: "123" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - password is empty', async () => {
        let data = { userName: "user1", password: "" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - username is already in used', async () => {
        let data = { userName: "test1", password: "123aa&GHad" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - password does not meet criteria', async () => {
        let data = { userName: "user1", password: "123aa" }
        fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Registration - Successful', async () => {
        let data = { userName: "user1", password: "123aa&GHad" }
        await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(201)
        })
    });

    test('Login - userName is not defined', async () => {
        let data = { userName1: "123", password: "123" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - userName is empty', async () => {
        let data = { userName: "", password: "123" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - password is not defined', async () => {
        let data = { userName: "user1", password1: "123" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - password is empty', async () => {
        let data = { userName: "user1", password: "" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - Username is not found', async () => {
        let data = { userName: "userx", password: "123aa&GHad" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - Password does not match with db', async () => {
        let data = { userName: "user1", password: "123aa&GHadx" }
        fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Login - Successful', async () => {
        let data = { userName: "user1", password: "123aa&GHad" }
        await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        .then(response => {
            expect(response.status).toBe(202)
        })
    });

    let user1Token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBiNGVlZmIzYTQ2MGMyODMzZGYwZjUiLCJpYXQiOjE2OTUyNDE4MTksImV4cCI6MTY5NTI1MjYxOX0.RSia0LRaQlB-VXvnRxRIuv9w3m014-1DDpVhbEHp1Fw"
    test('Create Note - Empty detail', async () => {
        let data = { contents: " " }
        fetch(`${url}/api/notes`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        .then(response => {
            expect(response.status).toBe(400)
        })
    });

    test('Create Note - Successful', async () => {
        let data = { contents: "User1 note 2" }
        await fetch(`${url}/api/notes`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        .then(response => {
            expect(response.status).toBe(200)
        })
    });

});

