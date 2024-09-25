import { Request,Response } from "express"
import { StatusCodes } from "http-status-codes"
import db from "../db"
import { Product } from "@prisma/client"
import CustomAPIError from "../errors/CustomAPIError"
enum COMPANY {
  ikea = 'ikea',
  liddy = 'liddy',
  caressa = 'caressa',
  marcos = 'marcos'
}
type OperatorMap =  '<=' | '<' | '>=' | '>' | '='

const createProducts = async (req:Request,res:Response)=>{
  const products:Product[] = req.body;
  const newProducts = await db.product.createMany({
    data:products,
  })
  res.status(StatusCodes.CREATED).json({newProducts,msg:'work'})
}
const deleteProducts = async (req:Request,res:Response)=>{
  const newProducts = await db.product.deleteMany({})
  res.status(StatusCodes.CREATED).json({newProducts,msg:'work'})
}

const getAllProductsStatic = async (req:Request,res:Response) =>{
  const products = await db.product.findMany({
    where:{
      name:{
        contains:'sectional'
      }
    }
  })
  res.status(StatusCodes.OK).json({npHint:products.length,products})
}
const getAllProducts= async (req:Request,res:Response) =>{

  const query = req.query;
  let queryParams:Object = {}
  let sortOptions:Array<Object> = []
  let selectOptions:Object = {}
  // pagination
  const page =(+(query?.page as string))  ||1
  const pageSize =(+(query?.limit as string))  ||10
  const skipped = (page - 1) * pageSize;

  // for numeric.
  

  // check for values if its exists or not.
  if('name' in query){queryParams = {...queryParams,name:{contains:query.name}}}
  if('featured' in query) {queryParams = {...queryParams,featured:query.featured==='true'?true:false}}
  if('company' in query) {
    const value:string = (query.company as string);
    for(const val in COMPANY){
      if(val.startsWith(value)) {
        queryParams = {...queryParams,company:val}
        break;
      }
    }
  }
  if('sort' in query){
    let options = (query.sort as string).split(',').map(option=>{
      if(option[0] === '-'){
        const newOption = option.slice(1,option.length+1);
        sortOptions = [
          ...sortOptions,
          {[newOption]:'desc'}
        ]
      }
      else sortOptions = [
        ...sortOptions,
        {[option]:'asc'}
      ]
      return ''
    })
  }
  if('select' in query){
    let options = (query.select as string).split(',').map(option=>{
      selectOptions = {
        ...selectOptions,
        [option] :true
      }
      return ''
    })
  }
  if('numeric' in query){
    const numericFilter = query.numeric as string;
    const options = ['price', 'rating'];
    const regex = /\b(<|>|<=|>=|=)\b/g
    const operatorMap = {
      '>=':'gte',
      '>':'gt',
      '=':'eq',
      '<':'lt',
      '<=':'lte',
    }
    const rawFilters = numericFilter.replace(regex,(matcher)=>{
      const match = matcher as OperatorMap;
      return `-${operatorMap[match]}-`;
    })

    const filters = rawFilters.split(',').forEach(item=>{
      const [filter,operator,value] = item.split('-')
      if(!(options.find(i => i == filter))) throw new CustomAPIError('there is an error',400)
      // @ts-ignore
      queryParams[filter] = {[operator]:+value}
      
    })
  }

  const isNotSelectedAny:boolean = ((Object.entries(selectOptions)).length == 0)

  const products = await db.product.findMany({
    where:queryParams,
    select:isNotSelectedAny?null: selectOptions,
    orderBy:sortOptions,
    skip:skipped,
    take:pageSize
  })
  res.status(StatusCodes.OK).json({nbHint:products.length,products})
}

export {
  getAllProducts,
  getAllProductsStatic,
  createProducts,
  deleteProducts
}