import express, { json, urlencoded } from 'express'
import dotenv from "dotenv";
import { routes } from './routes';
import swaggerSetup from './swaggerSetup';

dotenv.config();

const app = express()

app.use(json())
app.use(urlencoded({extended : true}))

app.use(routes)

swaggerSetup(app)


export default app