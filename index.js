const express=require("express");
const path=require("path");
const multer  = require('multer');
const URL=require('./models/url');
const urlRoute=require('./routes/url');
const staticRoute=require('./routes/staticRouter');
const userRoute=require('./routes/user');
const {restrictToLoggedUsersOnly}=require('./middlewares/auth');
const {connectToMongoDB }=require('./connection.js');
const cookieParser=require('cookie-parser');
const app=express();
const PORT=8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("Connected to MongoDb"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return cb(null,uniqueSuffix+"--"+file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.use("/url",restrictToLoggedUsersOnly,urlRoute);
app.use("/",userRoute);
app.use("/",restrictToLoggedUsersOnly,staticRoute);

app.post('/upload', upload.single('avatar'), (req, res)=> {
    console.log(req.body);
    console.log("Is here");
    console.log(req.file);
    return res.redirect("/");
});
app.get("/file",(req,res)=>{
    return res.render("fileUpload");
})
app.get('/read/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timestamp:Date.now()
            },
        }
    });
    return res.redirect(entry.redirectedURL);
})

app.listen(PORT,()=>console.log("Server Started at PORT: ",PORT));