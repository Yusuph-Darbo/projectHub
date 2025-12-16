import { createUser, getUserByEmail } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res)
{
    const {name, email, password} = req.body

    try {
        const existingUser = getUserByEmail(email)

        if (existingUser){
            return res.status(400).json({ error: 'User already exists' })
        }
        
        // 10 salt rounds - Adding 10 random strings before hashing
        const hashedPassword = await bcrypt.encrypt(password, 10)

        const newUser = await createUser({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'USER' 
        })

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}