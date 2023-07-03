const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const connect = require('mongoose').connect
const dbConnect = require('./db')
const cors = require('cors')

require('dotenv').config()

//authentication route
const authRoute = require('./routes/auth')

//view engine
 app.set('view engine', 'ejs')

//user routes
const userRoutes = require('./routes/userFileRoutes')
const adminRoute = require('./routes/adminFileRoutes')

const uri = process.env.MONGO_URI
const port = process.env.PORT || 7000

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use('/user',authRoute)

//admin middleware
app.use('/upload', adminRoute)
//app.use('/uploads',express.static('uploads'))

//user middleware
app.use(userRoutes)

const server = app.listen(port,() =>{
    console.log(`listening on port ${port}`)
    dbConnect(uri)
    .then(()=> console.log('connected to database'))
    .catch(err => console.error(err))

    // //handling errors if not connected
    process.on('unhandledRejection',err =>{
        console.log(`An error Occured: ${err.messge}`)
        server.close(()=> process.exit(1));
    })
})