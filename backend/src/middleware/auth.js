/* Intercepts the request to the controllers and verifies user using jwt,
   if the user is verified will pass the request along 
*/

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { getUserById } from '../models/user.js'

dotenv.config()

export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.header.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ error: 'No token provided' })
        }

        // Gets the token after the Bearer
        const token = authHeader.split('')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await getUserById(decoded.id)

        if (!user){
            return res.status(401).json({ error: 'User not found' })
        }

        // Attaching user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        // Go to next middleware / handler
        next()

    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
    next()
}