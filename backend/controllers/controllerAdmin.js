const express = require("express");
const businessDistribution = require("../models/file");
const fs = require('fs');
//const upload = require ('../fileMiddleware/upload')

//adding a file to the database
const addFile = async (req, res, next) => {
    const imageBuffer = fs.readFileSync(req.file.path)
    const base64Image = imageBuffer.toString('base64');

    let userAdd = new businessDistribution({
        title: req.body.title,
        description: req.body.description,
        myFile: base64Image,
        contentType: req.file.mimetype,
        filename: req.file.filename
    });
    await userAdd
        .save()
        .then((response) => {
            res.status(200).json({
                message: "File added sucessfully",
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "An error occured",
                error: error.message,
            });
        });
};

const getCounts = async (req, res) => {
    const fileId = req.params.id;
    try {
        const file = businessDistribution(fileId);
        if (!file) {
            return res.status(400).json({ message: "file not found" });
        }
        return res
            .status(200)
            .json({ emailCount: file.emailCount, downloadCount: file.downloadCount });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    addFile,
    getCounts,
};
