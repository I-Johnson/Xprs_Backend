import { Router } from "express";

const router = Router();


router.get("/api/products", (request, response) => {
    console.log(request.headers.cookie)
    console.log(request.cookies);
    console.log(request.signedCookies.hello);

    if (request.signedCookies.hello && request.signedCookies.hello === "world") 
        return response.send([{id: 123, name: "C B", price: 12.99}]);

    return response
        .status(403)
        .send({msg: "You are not authorized to view this content"});
})

export default router;