const express = require('express');
const businessDistribution = require('../models/file');
//const upload = require ('../fileMiddleware/upload')

//adding a file to the database
const addFile = async(req, res, next) =>{
    let userAdd = new businessDistribution({
        title: req.body.title,
        description: req.body.description
    })
    if (req.files)
    {
        let path = ''
        req.files.forEach(function(files,index,arr){
            path = path + files.path + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        userAdd.myFile = path
    }
    userAdd.save()
    .then(response =>{
        res.status(200).json({
            message:"File added sucessfully"
        })
    })
    .catch(error =>{
        res.status(400).json({
            message:"An error occured",
            error:error.message
        })
    })


}

module.exports =
{
    addFile,
} 