import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: ".env"})

const JWTSECRET = process.env.JWTSECRET

function requireAuth (req, res, next){
    const header = req.headers.authorization
    
    if (!header){
        return res.status(401).json({error: "Token requerido"})
    }

    const [scheme, token] = header.split(" ")

    if(scheme !== "Bearer" || !token){
        return res.status(401).json({error: "Token requerido"})
    }

    try {
        req.comprador = jwt.verify(token, JWTSECRET)
        next()
    } catch (error) {
        const msg = error.name === "TokenExpiredError" ? "Token expirado" : "Token Invalido"
        res.status(401).json({error: msg})
    }
}

export {requireAuth, JWTSECRET}