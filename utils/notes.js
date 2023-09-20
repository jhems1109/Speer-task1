import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import { getUserById, getUserByUsername } from "./user.js";

let ObjectId = mongoose.Types.ObjectId;

// Return notes created by or shared to user
export const getNotes = async function(req, res) {

    let userId = req.userId.toString()
    let promise1 = getUserById(userId)
    let promise2 = getNotesSharedToUser(userId)
    let [checkUser, othersNotes] = await Promise.all([promise1, promise2])

    if (checkUser.requestStatus !== "ACTC") {
        res.status(checkUser.statusCode).send({ message: checkUser.errMsg });
        return
    } else {
        let promise3 = checkUser.userDetails.notes.map(async function(note) { 
            if (note.sharedTo.length === 0) {
                return { noteId: note._id, contents: note.contents, createdAt: note.createdAt, updatedAt: note.updatedAt }
            } else {
                let promise4 = note.sharedTo.map(async function(recipient) { 
                    let receiverDetails = await getUserById(recipient.toString())
                    let receiverUserName = receiverDetails.userDetails.userName
                    return { userId : recipient, userName : receiverUserName}
                })
                const withUserDetails = await Promise.all(promise4)
                return { noteId: note._id, contents: note.contents, sharedTo : withUserDetails, createdAt: note.createdAt, updatedAt: note.updatedAt }
            }
        })
        let notesCreated = await Promise.all(promise3)

        return { notesCreated, notesSharedByOthers: othersNotes }
    }

}

// Return notes shared to user
export const getNotesSharedToUser = async function(userId) {

    let othersNotes = await UserModel.aggregate([ 
        { 
            $match : { 
                "notes.sharedTo": new ObjectId(userId)
            } 
        }, { 
            $project: {
                notes: {
                    $filter: {
                        input: "$notes",
                        as: "note",
                        cond: { 
                            $anyElementTrue: {
                                $map: {
                                    input: "$$note.sharedTo",
                                    in: { $eq : [ "$$this", new ObjectId(userId) ] }
                                }
                            },
                        }
                    }
                }, _id : 1, userName : 1, firstName : 1, lastName : 1, createdAt: 1, updatedAt : 1
            }
        }, { 
            $project: {
                notesShared: {
                    $map: {
                        input: "$notes",
                        as: "note",
                        in: { 
                            noteId: "$$note._id",
                            contents: "$$note.contents",
                            sharedBy: {
                                userId: "$_id",
                                userName: "$userName",
                                firstName: "$firstName",
                                lastName: "$lastName",
                            },
                            createdAt: "$$note.createdAt",
                            updatedAt: "$$note.updatedAt"
                        }
                    }
                }, _id : 0
            }
        }
    ])

    let notesSharedByOthers = []
    othersNotes.map(user => {
        user.notesShared.map(note => {
            notesSharedByOthers.push(note)
        })
    })
    return notesSharedByOthers

}

// Return note details : created by or shared to user
export const getNoteById = async function(req, res) {

    let userId = req.userId.toString()
    let noteId = req.params.id

    let noteDetails = await UserModel.findOne({ "notes._id" : new ObjectId(noteId) }, { 
        "notes.$": 1, _id: 1, userName : 1, firstName : 1, lastName : 1
    })

    if (!noteDetails || noteDetails === null) {
        res.status(404).send({ message: "Note is not found" });
        return
    }
    
    // If note id is found but user is not authorized, return 401 not found
    if (!noteDetails._id.equals(new ObjectId(userId)) && noteDetails.notes[0].sharedTo.findIndex(i => i.equals(new ObjectId(userId))) === -1) {
        res.status(401).send({ message: "Note is not found" });
        return
    }

    let contents = noteDetails.notes[0].contents
    let createdBy = { userName: noteDetails.userName, firstName: noteDetails.firstName, lastName: noteDetails.lastName }
    return { noteId, contents, createdBy, createdAt : noteDetails.notes[0].createdAt, updatedAt : noteDetails.notes[0].updatedAt }

}

export const createNote = async function(req, res) {

    let userId = req.userId.toString()

    // Note details is mandatory
    if (!req.body.contents || req.body.contents.trim() === "") {
        res.status(400).send({ message: "Note details is required" });
        return
    }
    let contents = req.body.contents.trim()
    
    // Add note to user's document
    let newNote = await UserModel.findOneAndUpdate({_id : new ObjectId(userId)}, {
        $push: { notes : {
            contents,
        } },
    }, { new: true })

    if (!newNote || newNote === null) {
        res.status(400).send({ message: "Note creation was not successful" });
        return
    }

    let index = newNote.notes.length -1
    let noteId = newNote.notes[index]._id

    // Return new note id
    res.status(200).send({ message: "Note creation was successful", noteId });
    return

}

export const updateNote = async function(req, res) {

    let userId = req.userId.toString()
    let noteId = req.params.id

    // New note details is mandatory
    if (!req.body.contents || req.body.contents.trim() === "") {
        res.status(400).send({ message: "Note details is required" });
        return
    }
    let contents = req.body.contents.trim()
    
    // Update note in user's document (Allow update only to creator)
    let updatedNote = await UserModel.updateOne({ _id : new ObjectId(userId), "notes._id" : new ObjectId(noteId) }, { 
        $set: { "notes.$[n1].contents" : contents}
        }, {arrayFilters: [ { "n1._id": new ObjectId(noteId) }] 
    })
    
    if (updatedNote.modifiedCount !== 1) {
        res.status(400).send({ message: "Note update was not successful" });
    } else {
        res.status(200).send({ message: "Note update was successful" });
    }
    return

}

export const deleteNote = async function(req, res) {

    let userId = req.userId.toString()
    let noteId = req.params.id
    
    // Delete note in user's document (Allow delete only to creator)
    let updatedNote = await UserModel.updateOne({ _id : new ObjectId(userId), "notes._id" : new ObjectId(noteId) }, { 
        $pull: { notes : {
            _id: new ObjectId(noteId)
        } } 
    })
    
    if (updatedNote.modifiedCount !== 1) {
        res.status(400).send({ message: "Note deletion was not successful" });
    } else {
        res.status(200).send({ message: "Note deletion was successful" });
    }
    return

}

export const shareNote = async function(req, res) {

    let userId = req.userId.toString()
    let noteId = req.params.id

    let noteDetails = await UserModel.findOne({ _id : new ObjectId(userId), "notes._id" : new ObjectId(noteId) }, { 
        "notes.$": 1, _id: 1, userName : 1
    })
    if (!noteDetails || noteDetails === null) {
        res.status(404).send({ message: "Note is not found" });
        return
    }
    if ((req.body.userId && noteDetails._id.equals(new ObjectId(req.body.userId))) || (req.body.userName && noteDetails.userName.toLowerCase() === req.body.userName.toLowerCase())) {
        res.status(403).send({ message: "Cannot share to yourself" });
        return
    }

    let userToShareTo
    if (req.body.userName && req.body.userName.trim() !== "") {
        userToShareTo = await getUserByUsername(req.body.userName.trim())
    } else if (req.body.userId && req.body.userId.trim() !== "") {
        userToShareTo = await getUserById(req.body.userId.trim())
    } else {
        res.status(400).send({ message: "Username or id of recipient is mandatory" });
        return
    }

    if (userToShareTo.requestStatus !== "ACTC") {
        res.status(userToShareTo.statusCode).send({ message: userToShareTo.errMsg });
        return
    }

    let addUserId = userToShareTo.userDetails._id
    let index = noteDetails.notes[0].sharedTo.findIndex(i => i.equals(addUserId))
    if (index !== -1) {
        res.status(400).send({ message: `Note was already shared to ${userToShareTo.userDetails.userName}` });
        return
    }
    
    // Add recipient's userId to note (Only the creator can share the note to others)
    let recordUpdated = await UserModel.updateOne({ _id : new ObjectId(userId), "notes._id" : new ObjectId(noteId) }, { 
        $push: { "notes.$.sharedTo" :
            addUserId
        } 
      })
    if (recordUpdated.modifiedCount !== 1) {
        res.status(400).send({ message: "Note was not successfully shared" });
    } else {
        res.status(200).send({ message: `Note was successfully shared to ${userToShareTo.userDetails.userName}` });
    }
    return

}

export const searchNotes = async function(req, res) {

    let userId = req.userId.toString()
    let searchText = req.query.q

    if (!searchText || searchText.trim() === "") {
        res.status(400).send({ message: "Search text is mandatory" });
        return
    }
    
    // Get notes created by user that matches the search text
    let promise1 = UserModel.aggregate([ 
        { 
            $match : { 
                _id: new ObjectId(userId), "notes.contents" : new RegExp(`${searchText}`, "i")
            } 
        }, { 
            $project: {
                notes: {
                    $filter: {
                        input: "$notes",
                        as: "note",
                        cond: {
                            $regexMatch: {
                                input: "$$note.contents",
                                regex: new RegExp(`${searchText}`, "i")
                            }
                        }
                    }
                }
            }
        }, { 
            $project: {
                notes: {
                    $map: {
                        input: "$notes",
                        as: "note",
                        in: { 
                            noteId: "$$note._id",
                            contents: "$$note.contents",
                            createdAt: "$$note.createdAt",
                            updatedAt: "$$note.updatedAt"
                        }
                    }
                }, _id : 0
            }
        }
    ])

    // Get notes shared to user that matches the search text
    let promise2 = UserModel.aggregate([ 
        { 
            $match : { 
                "notes.sharedTo": new ObjectId(userId), "notes.contents" : new RegExp(`${searchText}`, "i")
            } 
        }, { 
            $project: {
                notes: {
                    $filter: {
                        input: "$notes",
                        as: "note",
                        cond: { $and : [
                            { $regexMatch: {
                                input: "$$note.contents",
                                regex: new RegExp(`${searchText}`, "i")
                            } },
                            { 
                                $anyElementTrue: {
                                    $map: {
                                        input: "$$note.sharedTo",
                                        in: { $eq : [ "$$this", new ObjectId(userId) ] }
                                    }
                                }
                            },
                        ]}
                    }
                }, _id : 1, userName : 1, firstName : 1, lastName : 1, createdAt: 1, updatedAt : 1
            }
        }, { 
            $project: {
                notesShared: {
                    $map: {
                        input: "$notes",
                        as: "note",
                        in: { 
                            noteId: "$$note._id",
                            contents: "$$note.contents",
                            sharedBy: {
                                userId: "$_id",
                                userName: "$userName",
                                firstName: "$firstName",
                                lastName: "$lastName",
                            },
                            createdAt: "$$note.createdAt",
                            updatedAt: "$$note.updatedAt"
                        }
                    }
                }, _id : 0
            }
        }
    ])

    let [notesCreated, othersNotes] = await Promise.all([promise1, promise2])
    let ownNotesMatched = notesCreated.length > 0 ? notesCreated[0].notes : []
    let othersNotesMatched = []
    othersNotes.map(user => {
        user.notesShared.map(note => {
            othersNotesMatched.push(note)
        })
    })
    return { ownNotesMatched, othersNotesMatched }

}