const { request, response } = require('express');
const express = require('express');
const app = express();
const port = 3000;
const Pool = require('pg').Pool;
const bodyParser = require('body-parser');
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: 'postgres',
    port: 5432
})

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

app.put ('/updateuser/:id',(req,res)=>{
    try {
        
        const id = parseInt(request.params.id)
        const { name, email } = request.body
      
        pool.query(
          'UPDATE users SET name = $1, email = $2 WHERE id = $3',
          [name, email, id],
          (error, results) => {
            if (error) {
              console.log(error);
            }
            response.status(200).send(`User modified with ID: ${id}`)
          }
        )
    } catch (error) {
        console.log(error);
    }
});

app.post


// app.post('/users', db.createUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => console.log(`Server is running on ${port}`));