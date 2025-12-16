import client from '../config/db.js'

export async function createUser (name, email, hashedPassword, role)
{
    const res = await client.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role]
    )

    return res.rows[0]
}

export async function findUserByEmail (email)
{
    const res = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )

    return res.rows[0]
}

export async function findUserById (user_id)
{
    const res = await client.query(
        'SELECT * FROM users where user_id = $1',
        [user_id]
    )

    return res.rows[0]
}

export async function updateUser(user_id, name, email, role) 
{
    const res = await client.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             role = $3
         WHERE user_id = $4
         RETURNING *`,
         [name, email, role, user_id]
    )
    
    return res.rows[0]
}