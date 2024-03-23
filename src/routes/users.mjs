import { Router } from "express";
import { 
    query, 
    validationResult, 
    checkSchema, 
    matchedData 
} from "express-validator";
import {createUserValidationSchema} from '../utils/validationSchemas.mjs';
import {myUsers} from '../utils/constants.mjs';
import { resolveIndexByUserId } from "../utils/middlewares.mjs";


const router = Router();

router.get(
    "/api/users", 
    query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({min: 3, max:10})
    .withMessage("Must be at least 3-10 chars"),
    (request, response) => {
        console.log(request.session.id) 
        request.sessionStore.get(request.session.id, (err, sessionData) => {
            if(err) {
                console.log(err);
                throw err;   
            }
            console.log(sessionData)
        })
        const result = validationResult(request);
        console.log(result);

    const {
        query: {filter, value}
    } = request;
    // when filter and value are undefined
    if (filter && value) return response.send(
        myUsers.filter((user) => user[filter].includes(value))
    );

    return response.send(myUsers)
});

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
    console.log(request.params);
    
    const {findUserIndex} = request;
    const findUser = myUsers[findUserIndex]; 
    if(!findUser) return response.sendStatus(404);

    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
});


router.post("/api/users", checkSchema(createUserValidationSchema), (request, response) => {
    const result = validationResult(request);
    console.log(result) 

    if (!result.isEmpty())
        return response.status(400).send({errors: result.array()})

    const data = matchedData(request);

    const newUser = { id: myUsers[myUsers.length - 1].id + 1, ...data };
    myUsers.push(newUser); 

    return response.status(201).send(newUser);
})

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const {body, findUserIndex  } = request;

    myUsers[findUserIndex] = { id: myUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) =>{
    const {
        body, findUserIndex
    } = request;

    myUsers[findUserIndex] = {...myUsers[findUserIndex], ...body}
    return response.sendStatus(200)
})

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const {
        findUserIndex
    } = request;
    myUsers.splice(findUserIndex, 1);
    return response.sendStatus(200); 

})

export default router;