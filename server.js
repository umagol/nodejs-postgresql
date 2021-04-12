/**
 * Name: Satish Umagol
 * Project Name: Nodejs and postgresql Database
 * Git Repository: https://github.com/umagol/nodejs-postgresql
 * version: 1.0.0
 */

const express = require('express'); //  import expressjs
const app = express();
const port = 3000; // select port for server 
const Pool = require('pg').Pool; // import postgresql package in npm 
// First install package => npm install pg --save
const dotenv = require('dotenv'); //dotenv for access .env file

dotenv.config(); // configure .env file 

app.use(express.json()); // user body parser

// Data Base Connection
const pool = new Pool({
    user: process.env.UserName,
    host: process.env.Host,
    database: process.env.DataBaseName,
    password: process.env.Password,
    port: process.env.Port
});

/**
 * First API Get user
 * Get all user in Database
 */
app.get('/getuser', (req, res) => {
    try {
        pool.query('SELECT * FROM users ORDER BY ID ASC', (err, results) => {
            if (err) {
                console.log(err)
            }
            res.status(200).send(results.rows)
        })
    } catch (error) {
        console.log(error)
    }
});

/**
 * Select specifc user from database
 */
app.get('/getuser/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        pool.query(`SELECT * FROM users WHERE id = $1 `, [id], (err, results) => {
            if (err) {
                throw err
            }
            res.status(200).send(results.rows)
        })
    } catch (error) {
        console.log(error);
    }
});

/**
 * Update User Data
 */
app.put('/updateuser/:id', (req, res) => {
    try {

        const id = parseInt(req.params.id)
        const { name, email } = req.body

        pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3',
            [name, email, id],
            (error, results) => {
                if (error) {
                    console.log(error);
                }
                res.status(200).send(`User modified with ID: ${id}`)
            }
        )
    } catch (error) {
        console.log(error);
    }
});

/**
 * Add New User in Database
 */

app.post('/adduser', (req, res) => {
    try {

        const { name, email } = req.body

        pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
            if (error) {
                console.log(error);
            }
            res.status(201).send(`User added with ID: ${results.insertId}`)
        })

    } catch (error) {
        console.log(error);
    }
});

/**
 * delete User from Database
 */
app.delete('/deleteuser/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id)

        pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
            if (error) {
                console.log(error)
            }
            res.status(200).send(`User deleted with ID: ${id}`)
        })
    } catch (error) {

        console.log(error)
    }
});

//Listen server on port 3000
app.listen(port, () => console.log(`Server is running on ${port}`));

//-----------------------------------------------------------------------