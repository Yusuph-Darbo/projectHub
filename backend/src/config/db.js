import pkg from 'pg'

const {Client} = pkg

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootUser",
    database: "yusuphdarbo"
})

await client.connect()

export default client