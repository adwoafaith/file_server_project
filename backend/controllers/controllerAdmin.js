const express = require("express");
const businessDistribution = require("../models/file");
const fs = require('fs');
//const upload = require ('../fileMiddleware/upload')

//adding a file to the database
const addFile = async (req, res, next) => {
  let userAdd = new businessDistribution({
    title: req.body.title,
    description: req.body.description,
    myFile: Buffer.from(req.file.toString("base64"), "base64"),
    contentType: req.file.mimetype
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
      .json({message: "Internal Server Error",error:error.message });
  }
};

module.exports = {
  addFile,
  getCounts,
};
