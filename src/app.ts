import 'express-async-errors';
import express, { Request, Response } from 'express';
// middle wares
import notFound from './middleware/notFound';
import errorHandlerMiddleWare from './middleware/errorHandlerMiddleware';
// routes
import productRoute from './routes/products'

const app = express();
const PORT = process.env.PORT || 3000;



// static middle ware.
app.use(express.json());


// routes.
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript and Prisma!');
});
app.use('/api/v1/products',productRoute);


// errors middle wares
app.use(errorHandlerMiddleWare)
app.use(notFound)


// start the server.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});