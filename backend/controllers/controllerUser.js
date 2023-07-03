const express = require('express')
const businessDistribution = require('../models/file')
const { findOne } = require('../models/user')

//show all file
const findAllFiles = async(req, res, next) =>{
    businessDistribution.find()
    .then(response =>{
        res.status(200).json({response})
    }) 
    .catch(error=>{
        res.status(400).json({
            message:"An error occured please try again later"
        })
    })
}

//searching through the file server
const findFiletitle = async (req, res, next) =>{
    const {title} = req.body;
    if (!title)
    {
        res.status(200).json({message:`Please provide a title`})
    }
    try{
        const file = await businessDistribution.findOne({title})
        if (!file)
        {
            res.status(400).json({
                message: `There is no file by name ${file}`
            })
        }
        else {
            res.status(200).json({
                sucess: true, message: file
            })
        }
    }
    catch(error){
        res.status(400).json({
            message:`An error occured`,
            error:error.message
        })
    }
}

module.exports = {
    findAllFiles,
    findFiletitle
}