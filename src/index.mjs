import express from 'express';
import { query, validationResult, body, matchedData, checkSchema } from "express-validator"; 
import {createUserValidationSchema} from './utils/validationSchemas.mjs'
const app = express()

app.use(express.json())

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const myUsers = [
    {id: 1, username: "anson", displayName: "Anson"},
    {id: 2, username: "manson", displayName: "Manson"}, 
    {id: 3, username: "janson", displayName: "Janson"},
    {id: 4, username: "subedi", displayName: "Subedi"}
]

const resolveIndexbyUserID = (request, response, next) => {
    const {
        params: {id}
    } = request;
    const parsedID = parseInt(id);
    if(isNaN(parsedID)) return response.sendStatus(400);

    const findUserIndex = myUsers.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
} 

app.get("/", 
    (request, response, next) => {
        console.log("Base URL 1");
        next();
    },
    (request, response, next) => {
        console.log("Base URL 2");
        next();
    },
    (request, response, next) => {
        console.log("Base URL 3");
        next();
    },
    (request, response) => {
    response.status(201).send({msg: "Hello!  "});
});

app.get("/api/users", query("filter").isString()
    .notEmpty().withMessage("Must not be empty")
    .isLength({min: 3, max:10}).withMessage("Must be at least 3-10 chars"),
     (request, response) => {
    console.log(request["express-validator#contexts"]);
    const result = validationResult(request);
    console.log(result)
    const {query: {filter, value}} = request;
    // when filter and value are undefined
    if (filter && value) return response.send(
        myUsers.filter((user) => user[filter].includes(value))
    );

    return response.send(myUsers)
})

app.post("/api/users", checkSchema(createUserValidationSchema), (request, response) => {
        const result = validationResult(request);
        console.log(result) 

        if (!result.isEmpty())
            return response.status(400).send({errors: result.array()})

        const data = matchedData(request);



        const newUser = { id: myUsers[myUsers.length - 1].id + 1, ...data };
        myUsers.push(newUser);

        return response.status(201).send(newUser);
})

app.put("/api/users/:id", resolveIndexbyUserID, (request, response) => {
    const {body, findUserIndex  } = request;

    myUsers[findUserIndex] = { id: myUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
})

app.get("/api/users/:id", resolveIndexbyUserID, (request, response) => {
    console.log(request.params);
    
    const {findUserIndex} = request;
    const findUser = myUsers[findUserIndex]; 
    if(!findUser) return response.sendStatus(404);

    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
})

app.patch("/api/users/:id", resolveIndexbyUserID, (request, response) =>{
    const {
        body, findUserIndex
    } = request;

    myUsers[findUserIndex] = {...myUsers[findUserIndex], ...body}
    return response.sendStatus(200)
})

app.delete("/api/users/:id", resolveIndexbyUserID, (request, response) => {
    const {
        findUserIndex
    } = request;
    myUsers.splice(findUserIndex, 1);
    return response.sendStatus(200); 

})

app.get("/api/products", (request, response) => {
    response.send([
        { id: 123, name: "C B", price: 12.99}
    ])
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})