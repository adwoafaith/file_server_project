const express = require("express");
const nodemailer = require("nodemailer");
const businessDistribution = require("../models/file");
require("dotenv").config();
const { findOne } = require("../models/user");

//show all file
const findAllFiles = async (req, res, next) => {
  await businessDistribution
    .find()
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((error) => {
      res.status(400).json({
        message: "An error occured please try again later",
      });
    });
};

//searching through the file server
const findFiletitle = async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    res.status(200).json({ message: `Please provide a title` });
  }
  try {
    const file = await businessDistribution.findOne({ title });
    if (!file) {
      res.status(400).json({
        message: `There is no file by name ${file}`,
      });
    } else {
      res.status(200).json({
        sucess: true,
        message: file,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: `An error occured`,
      error: error.message,
    });
  }
};

const sendEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  console.log(id);
  console.log(email);
  // TODO: Use nodemailer to mail the file to the above email
  try {
    const file = await businessDistribution.findById(id);
    console.log(file);
    if (!file) {
      return res
        .status(400)
        .json({ message: "The file is not in the database" });
    }
    const mail = process.env.USER_NAME;
    const password = process.env.APP_PASSWORD;
    console.log(`mail ${mail}`);
    console.log(`password ${password}`);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: mail,
        pass: password,
      },
    });
    //email options
    const message = {
      from: mail,
      to: email,
      subject: "File from Employee",
      Text: "This is the file",
      attachments: [
        {
          filename: file.filename,
          content: file.myFile.type,
          contentType: file.myFile.contentType,
        },
      ],
    };
    transporter.sendMail(message, async (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(400)
          .json({ sucess: false, message: "Email not send" });
      }
      //Update the counting of th email,save file
      file.emailCount += 1;
      await file.save();
      return res
        .status(200)
        .json({ sucess: true, message: "File sent to email" });
    });
    // Cast to ObjectId failed for value \"{ id: '64a831eeb973a7934a635203' }\" (type Object) at path \"_id\" for model \"businessDistribution\""
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There was an internal error", error: error.message });
  }
};



const downloadFile = async (req, res) => {
  // TODO: implement the file download....
  const fileId = req.params.id;

  try{
    const file = await businessDistribution.findById(fileId);
    if(!file){
      return res.status(404).json({message: "file does not exist"})
    }

    console.log(file)
    res.download(`./uploads/${file.filename}`);
  }catch(err){
    return res.status(500).json({message: "Internal Server Error", err:err.message})
  }
};



module.exports = {
  findAllFiles,
  findFiletitle,
  sendEmail,
  downloadFile,
};
