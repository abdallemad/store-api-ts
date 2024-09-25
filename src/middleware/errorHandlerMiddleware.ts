import { Request,Response,NextFunction } from "express";
import CustomAPIError from "../errors/CustomAPIError";
import { StatusCodes } from "http-status-codes";


const errorHandlerMiddleWare = async (err:any,req:Request,res:Response,next:NextFunction)=>{
  console.log(err)
  if(err instanceof CustomAPIError){
    res.status(err.statusCode).json({msg:err.message});
  }
  else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'some thing wrong please try again later'})
}

export default errorHandlerMiddleWare