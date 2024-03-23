import express from 'express';
import router from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';


const app = express()

app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'Johnson on dev', // using simple string for dev purposes
    saveUninitialized: false, // don't save unmodified session data (for memory purposes)
    resave: false, // don't resave session data if not modified
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 // user can be logged in for 24 hours
    }
}));
app.use(express.json())
app.use(router);

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    console.log(request.session);
    console.log(request.sessionID);
    request.session.visited = true; // session data is stored in memory by default to track user visits
    response.cookie('hello', 'world', {maxAge: 30000, signed: true}) 
    response.status(201).send({msg: "Welcome to the API"})
});


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
}) 