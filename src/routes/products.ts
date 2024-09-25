import express from 'express'
import { createProducts, deleteProducts, getAllProducts,getAllProductsStatic } from '../controlers/products-controler';
const route = express.Router();

route.route('/static').get(getAllProductsStatic)
route.route('/').get(getAllProducts).post(createProducts);


export default route