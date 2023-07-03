const connect = require('mongoose').connect


//conneting to the database
const dbConnect = async (uri) =>{
    
        await connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,            
        })  
    }

module.exports = dbConnect;