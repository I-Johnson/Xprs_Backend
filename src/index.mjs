import express, { response } from 'express';
import router from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { myUsers } from './utils/constants.mjs';
import e from 'express';


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

app.post("/api/auth", (request, response) => {
    const {
        body: {username, password},
    } = request; 
    const findUser = myUsers.find(
        user => user.username === username
    );
    if (!findUser || findUser.password !== password) 
        return response.status(401).send({msg: "Invalid credentials"});
    
    request.session.user = findUser;
    return response.status(200).send(findUser);
})

app.get("/api/auth/status", (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session);
    });
    return request.session.user ? response.status(200).send(request.session.user) 
    : response.status(401).send({msg: "Unauthorized"});
})

app.post("/api/cart", (request,response) => {
    if(!request.session.user) return response.sendStatus(401);
    const {body: item} = request;

    const {cart} = request.session;
    if(cart) {
        cart.push(item);
    }
    else {
        request.session.cart = [item];
    }
    return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    return response.send(request.session.cart || []);
})