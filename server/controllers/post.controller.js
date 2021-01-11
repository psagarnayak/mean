const router = require('express').Router();
const postModel = require('../model/post.model');

router.get("/", (req, res) => {

    postModel.find({}).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        console.log("Error fetching posts: ", error);
    });
});

router.post("/", (req, res) => {

    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save().then((result) => {
        res.status(201).json({ success: true, message: `Post Saved Successfully!`, post: newPost });
    }).catch((err) => {
        res.status(500).json({ success: false, message: `Save Failed!`, error: err });
    });

});

router.delete("/:id", (req, res) => {

    const id = req.params['id'];

    postModel.deleteOne({ '_id': id }).then((result) => {
        console.log("Delete Executed, result: ", result);
        if (result.n == 0) {
            res.status(404).json({ success: false, message: `Post with id ${id} NOT FOUND!` });
        } else if (result.deletedCount >= 1) {
            res.status(200).send({ success: true, message: `Post with id ${id} DELETED!` });
        } else {
            res.status(200).send({ success: false, message: `Post with id ${id} could NOT be deleted!` });
        }
    }).catch((err) => {
        console.log("Error on delete: ", err);
        res.status(500).json({ message: 'Error Occured', err });
    });
});

router.put('/:id', (req, res) => {
    const id = req.params['id'];
    postModel.updateOne({ '_id': id }, { title: req.body.title, content: req.body.content }).then((result) => {
        console.log("Update Executed, result: ", result);
        if (result.nModified >= 1) {
            postModel.findById(id).then(doc => {
                res.status(200).json(
                    { success: true, message: `Post with id ${id} Updated!`, post: doc });
            }).catch(err => {
                res.status(200).json(
                    { success: false, message: `Error Occured!`, error: err });
            });
        } else if (result.n == 0) {
            res.status(404).json(
                { success: false, message: `Post with id ${id} NOT FOUND!` });
        } else if (result.nModified == 0) {
            res.status(200).json(
                { success: true, message: `Post with id ${id} is already Up to Date!` });
        } else {
            res.status(200).json({ success: false, message: `Post with id ${id} could NOT be Updated!` });
        }
    }).catch((err) => {
        console.log("Error on update: ", err);
        res.status(500).json({ success: false, message: `Error Occured!`, error: err });
    });
});

module.exports = router;