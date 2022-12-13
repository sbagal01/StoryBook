const express=require('express');
const app=express();
const path=require('path');
const dotenv=require('dotenv');
const connectDb=require('./config/db.js');
const mongoose=require('mongoose');
const passport=require('passport');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const methodOverride=require('method-override');

//Load Config
dotenv.config({path: './config/config.env'});
connectDb()

//Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Body parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Passport config
require('./config/passport')(passport)

//handlebar helpers
const {formatDate,truncate,scriptTags,editIcon,select}=require('./helpers/hbs');

app.engine('.hbs',exphbs.engine({helpers:{formatDate,truncate,scriptTags,editIcon,select},defaultLayout:'main', extname:'.hbs'}));
app.set('view engine','.hbs');

//session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl:process.env.mongoUrl})
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//global user
app.use((req,res,next)=>{
    res.locals.user=req.user || null;
    next();
})
app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body=='object' && '_method' in req.body){
        let method=req.body._method;
        delete req.body._method
        return method
    }
}))

//Router
app.use('/',require('./router/index'));
app.use('/auth',require('./router/auth'));
app.use('/stories',require('./router/stories'));

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}
const PORT=process.env.PORT ||5001;
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} node on prot ${PORT}`)
});