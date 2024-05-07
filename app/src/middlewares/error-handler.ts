import { NextFunction, Request, Response } from "express"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        success: false,
        message: err.message
    })
}