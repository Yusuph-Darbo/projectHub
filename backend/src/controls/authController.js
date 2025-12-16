import { createUser, getUserByEmail } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// Importing my jwt passkey from .env
dotenv.config();

export async function register(req, res)
{
    // Object destructuring
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

export async function login (req, res)
{
    const { email, password } = req.body

    try {
        const user = await getUserByEmail(email)
        if (!user){
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, hashedPassword)
        if (!isMatch){
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Create a JWT token containing the user's ID, signed with the server secret
        // Will expire in an 1 hour and can be used by the client to authenticate future requests
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}