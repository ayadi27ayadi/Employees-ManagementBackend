import jwt  from "jsonwebtoken"
import { JWT_SECRET } from "../config/configue.js"

export const checkRole= (roles, req, res, next)=> {
        
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, JWT_SECRET); 
    (roles.includes(decodedToken.role)) ? next() : res.status(403).json({error: 'acces denieted'})
}