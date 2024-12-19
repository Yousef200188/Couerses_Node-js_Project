const express = require('express');
const app = express();
const courseRouter = require('./routes/course.route')
const userRouter = require('./routes/user.route')
const mongoose = require("mongoose");
require('dotenv').config()
const httStatus = require('./utilits/httpStatus')
const cors = require('cors');
const res = require('express/lib/response');
const path = require('path')

app.use(cors())
app.use(express.json());
app.use('/api/courses',courseRouter)
app.use('/api/users',userRouter)
app.use('/uploads',express.static(path.join(__dirname,'Uploads')))
app.all('*',(req,res,next)=>{
   return res.status(400).json({ status: httStatus.ERROR, data: null, message:"this resourse is not availble" })

})
app.use((error,req,res,next)=>{
  return res.status(error.statusCode||404).json({status:error.statusText||404,message:error.message||'invalide',data:null});
})   
const url = process.env.MONGO_URL;
const port = process.env.PORT;
async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log('Mongoose connected correctly');
  } catch (error) {
    console.error('Error connecting to Mongoose:', error);
  }
}
connectDB();

app.listen(port,()=>{
  console.log('server connected successflly at port:4000');
})

