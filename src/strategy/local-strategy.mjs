import passport from 'passport';
import {Strategy} from 'passport-local';
import { myUsers } from '../utils/constants.mjs';


// when the user is authenticated and passport is trying to store the user in the session store
passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
})

// deserializeUser is called when the user is trying to access the session data 
// and passport is trying to get the user from the session store 
passport.deserializeUser((id, done) => {
    try{
        const findUser = myUsers.find((user) => user.id === id);
        console.log(`Inside Deserialize User`);
        console.log(`Deserializing User ID: ${id}`);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (err) {
        done(err, null)
    }
})

export default passport.use(
    new Strategy((username, password, done) => {
        // checking for user and their password
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try{
            const findUser = myUsers.find((user) => user.username === username);
            if(!findUser) throw new Error("User not found");
            if (findUser.password !== password) throw new Error("Invalid password");

            done(null, findUser);

        } catch (err) {
            done(err, null);
        }
    })
)