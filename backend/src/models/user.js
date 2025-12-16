import client from '../config/db.js'

export async function createUser (name, email, hashedPassword, role)
{
    try {
        const res = await client.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, role]
    )

        return res.rows[0]
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
    
}

export async function findUserByEmail (email)
{
    try {
        const res = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
    )

        return res.rows[0]
    } catch (err) {
        console.error('Error searching for user:', err);
        throw err;
    }
    
}

export async function findUserById (user_id)
{
    try {
        const res = await client.query(
            'SELECT * FROM users where user_id = $1',
            [user_id]
    )

        return res.rows[0]
    } catch (err) {
        console.error('Error searching for user:', err);
        throw err;
    }
    
}

export async function updateUser(user_id, updates) 
{
    try {
        const keys = Object.keys(updates)
        if (keys.length === 0) return null // Nothing to update

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')
        const values = Object.values(updates)
        values.push(user_id) // Add user_id for WHERE clause



        const res = await client.query(
            `UPDATE users
            SET ${setClause}
            WHERE user_id = $${values.length}
            RETURNING *`,
            [values]
    )
        return res.rows[0]
    
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
    
}