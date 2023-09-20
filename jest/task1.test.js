const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 8000;
const url = `http://localhost:${port}`

describe('Test task 1 functions', function () {

    test('Registration - userName is not defined', async () => {
        let data = { userName1: "123", password: "123" }
        let response = await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username is mandatory")
    });

    test('Registration - userName is empty', async () => {
        let data = { userName: "", password: "123" }
        let response = await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username is mandatory")
    });

    test('Registration - password is not defined', async () => {
        let data = { userName: "user1", password1: "123" }
        let response = await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Password is mandatory")
    });

    test('Registration - password is empty', async () => {
        let data = { userName: "user1", password: "" }
        let response = await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Password is mandatory")
    });

    test('Registration - username is already in used', async () => {
        let data = { userName: "test1", password: "123aa&GHad" }
        let response = await fetch(`${url}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("The username is not available")
    });

    test('Registration - password does not meet criteria', async () => {
        let data = { userName: "user1", password: "123aa" }
        await fetch(`${url}/api/auth/signup`, {
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
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username and password are mandatory")
    });

    test('Login - userName is empty', async () => {
        let data = { userName: "", password: "123" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username and password are mandatory")
    });

    test('Login - password is not defined', async () => {
        let data = { userName: "user1", password1: "123" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username and password are mandatory")
    });

    test('Login - password is empty', async () => {
        let data = { userName: "user1", password: "" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username and password are mandatory")
    });

    test('Login - Username is not found', async () => {
        let data = { userName: "userx", password: "123aa&GHad" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Incorrect username or password")
    });

    test('Login - Password does not match with db', async () => {
        let data = { userName: "user1", password: "123aa&GHadx" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Incorrect username or password")
    });

    let user1Token = "", user1Id = ""
    test('Login - Successful', async () => {
        let data = { userName: "user1", password: "123aa&GHad" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        expect(response.status).toBe(202)
        let resp = await response.json()
        user1Token = `Bearer ${resp.token}`
        user1Id = resp.userId
    });

    test('Create Note - Empty detail', async () => {
        let data = { contents: " " }
        let response = await fetch(`${url}/api/notes`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Note details is required")
    });

    let noteId1 = ""
    test('Create Note - Successful', async () => {
        let data = { contents: "User1 note 1" }
        let response = await fetch(`${url}/api/notes`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
        let resp = await response.json()
        noteId1 = resp.noteId
    });

    test('Update Note - Empty detail', async () => {
        let data = { contents: " " }
        let response = await fetch(`${url}/api/notes/${noteId1}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Note details is required")
    });

    test('Update Note - Successful', async () => {
        let data = { contents: "User1 note 2 new text" }
        let response = await fetch(`${url}/api/notes/${noteId1}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
    });

    test('Get Note - not found', async () => {
        let noteIdx = "650b766d0603313e95a1ac48"
        let response = await fetch(`${url}/api/notes/${noteIdx}`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(404)
        let resp = await response.json()
        expect(resp.message).toBe("Note is not found")
    });

    test('Get Note - found but user is not authorized to note', async () => {
        let noteIdx = "650a1d85c4e61a6d4e4ef0d8"
        let response = await fetch(`${url}/api/notes/${noteIdx}`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(401)
        let resp = await response.json()
        expect(resp.message).toBe("Note is not found")
    });

    test('Get Note - successful', async () => {
        let response = await fetch(`${url}/api/notes/${noteId1}`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
        let resp = await response.json()
        expect(resp.contents).toBe("User1 note 2 new text")
    });

    test('Delete Note - found but user is not authorized to note', async () => {
        let noteIdx = "650a1d85c4e61a6d4e4ef0d8"
        let response = await fetch(`${url}/api/notes/${noteIdx}`, {
            method: "DELETE",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Note deletion was not successful")
    });

    test('Delete Note - successful', async () => {
        let response = await fetch(`${url}/api/notes/${noteId1}`, {
            method: "DELETE",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
    });

    test('Get Note - successfully deleted', async () => {
        let response = await fetch(`${url}/api/notes/${noteId1}`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(404)
    });

    test('Create New Note Then Share', async () => {
        let data = { contents: "User1 new note 1" }
        let response = await fetch(`${url}/api/notes`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
        let resp = await response.json()
        noteId1 = resp.noteId
    });

    test('Share Note - not found', async () => {
        let noteIdx = "650b766d0603313e95a1ac48"
        let data = { userName: "test1" }
        let response = await fetch(`${url}/api/notes/${noteIdx}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(404)
        let resp = await response.json()
        expect(resp.message).toBe("Note is not found")
    });

    test('Share Note - own userName', async () => {
        let data = { userName: "user1" }
        let response = await fetch(`${url}/api/notes/${noteId1}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(403)
        let resp = await response.json()
        expect(resp.message).toBe("Cannot share to yourself")
    });

    test('Share Note - own userId', async () => {
        let data = { userId: user1Id }
        let response = await fetch(`${url}/api/notes/${noteId1}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(403)
        let resp = await response.json()
        expect(resp.message).toBe("Cannot share to yourself")
    });

    test('Share Note - userName and userId are empty', async () => {
        let data = { userId: "", userName: "" }
        let response = await fetch(`${url}/api/notes/${noteId1}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Username or id of recipient is mandatory")
    });

    test('Share Note - successfully shared', async () => {
        let data = { userName: "test2" }
        let response = await fetch(`${url}/api/notes/${noteId1}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(200)
    });

    test('Share Note - User shares again to another user that has already been granted', async () => {
        let data = { userName: "test2" }
        let response = await fetch(`${url}/api/notes/${noteId1}/share`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON", "Authorization": user1Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe(`Note was already shared to ${data.userName}`)
    });

    let user2Token = "", user2Id = ""
    test('Login - Successful', async () => {
        let data = { userName: "test2", password: "12345678A@" }
        let response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "Application/JSON" }
        })
        let resp = await response.json()
        user2Token = `Bearer ${resp.token}`
        user2Id = resp.userId
    });

    test('Search Note - text is empty', async () => {
        let response = await fetch(`${url}/api/search`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user2Token }
        })
        expect(response.status).toBe(400)
        let resp = await response.json()
        expect(resp.message).toBe("Search text is mandatory")
    });

    test('Search Note - text is not empty', async () => {
        let response = await fetch(`${url}/api/search?q=nOTe`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user2Token }
        })
        expect(response.status).toBe(200)
    });

    test('Get Notes', async () => {
        let response = await fetch(`${url}/api/notes`, {
            method: "GET",
            headers: { "Content-Type": "Application/JSON", "Authorization": user2Token }
        })
        expect(response.status).toBe(200)
    });

});

