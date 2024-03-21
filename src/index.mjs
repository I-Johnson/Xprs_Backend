import express from 'express';
import router from './routes/index.mjs';


const app = express()

app.use(router);
app.use(express.json())

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})