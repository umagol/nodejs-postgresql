# What is a RESTful API?

Representational state transfer (REST) defines a set of standards for web services. An API is an interface that software programs use to communicate with each other. Therefore, a RESTful API is an API that conforms to the REST architectural style and constraints.

REST systems are stateless, scalable, cacheable, and have a uniform interface.

# What is a CRUD API?

When building an API, you want your model to provide four basic functionalities: it should be able to create, read, update, and delete resources. This set of essential operations is commonly referred to as CRUD.

RESTful APIs most commonly utilize HTTP requests. Four of the most common HTTP methods in a REST environment are GET, POST, PUT, and DELETE, which are the methods by which a developer can create a CRUD system.

Here’s how to apply CRUD in a REST environment:

    Create — To create a resource in a REST environment, use the HTTP POST method
    Read — To read a resource, use the GET method. Reading a resource retrieves data without altering it
    Update — To update a resource, use the PUT method
    Delete — To remove a resource from the system, use the DELETE method

# What is Express.js?

Express.js is one of the most popular frameworks for Node.js. In fact, the “E” in MERN, MEVN, and MEAN Stack stands for “Express.”

According to the official Express.js documentation, “Express is a fast, unopinionated, minimalist web framework for Node.js.”

Although Express is minimalist, it is also very flexible, which has led to the development of various Express middlewares that can be used to address almost any task or problem you can think of.
What is PostgreSQL?

PostgreSQL, commonly referred to as Postgres, is a free and open-source relational database management system. You might be familiar with a few other similar database systems, such as MySQL, Microsoft SQL Server, or MariaDB, which compete with PostgreSQL.

PostgreSQL is a robust but stable relational database that has been around since 1997 and is available on all major operating systems — Linux, Windows, and macOS. Since PostgreSQL is known for stability, extensibility, and standards compliance, it’s a popular choice for developers and companies to use for their database needs.

It’s also possible to create a Node.js RESTful CRUD API using Sequelize. Sequelize is a promise-based Node.js ORM for for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

For more on how to use Sequelize in a Node.js REST API, check out the video tutorial below.

# What is node-postgres?

node-postgres is a nonblocking PostgreSQL client for Node.js. Essentially, node-postgres is a collection of Node.js modules for interfacing with a PostgreSQL database.

Among the many features node-postgres supports are callbacks, promises, async/await, connection pooling, prepared statements, cursors, rich type parsing, and C/C++ bindings.
Creating a PostgreSQL database

We’ll begin this tutorial by installing PostgreSQL, creating a new user, creating a database, and initializing a table with schema and some data.
Installation

If you’re using Windows, download a Windows installer of PostgreSQL.

If you’re using a Mac, this tutorial assumes you have Homebrew installed on your computer as a package manager for installing new programs. If you don’t, simply click on the link and follow the instructions to install Homebrew.

Open up the Terminal and install postgresql with brew.

    brew install postgresql

You may see instructions on the web that will say brew install postgres instead of postgresql. Both of these options will install PostgreSQL on your computer.

After the installation is complete, we’ll want to get the postgresql up and running, which we can do with services start.

    brew services start postgresql
    ==> Successfully started `postgresql` (label: homebrew.mxcl.postgresql)

If at any point you want to stop the postgresql service, you can run brew services stop postgresql.

PostgreSQL is installed now, so the next step is to connect to the postgres command line, where we can run SQL commands.
PostgreSQL command prompt

psql is the PostgreSQL interactive terminal. Running psql will connect you to a PostgreSQL host. Running psql --help will give you more information about the available options for connecting with psql.

    --h — --host=HOSTNAME | database server host or socket directory (default: “local socket”)
    --p — --port=PORT | database server port (default: “5432”)
    --U — --username=USERNAME | database username (default: “your_username”)
    --w — --no-password | never prompt for password
    --W — --password | force password prompt (should happen automatically)

We’ll just connect to the default postgres database with the default login information – no option flags.

    psql postgres

You’ll see that we’ve entered into a new connection. We’re now inside psql in the postgres database. The prompt ends with a # to denote that we’re logged in as the superuser, or root.

    postgres=#

Commands within psql start with a backslash (\). To test our first command, we can ensure what database, user, and port we’ve connected to by using the \conninfo command.

    postgres=# \conninfo
    You are connected to database "postgres" as user "your_username" via socket in "/tmp" at port "5432".

Here is a reference table of a few common commands which we’ll be using in this tutorial.

    \q | Exit psql connection
    \c | Connect to a new database
    \dt | List all tables
    \du | List all roles
    \list | List databases

Let’s create a new database and user so we’re not using the default accounts, which have superuser privileges.
Creating a role in Postgres

First, we’ll create a role called me and give it a password of password. A role can function as a user or a group, so in this case, we’ll be using it as a user.

    postgres=# CREATE ROLE me WITH LOGIN PASSWORD 'password';

We want me to be able to create a database.

    postgres=# ALTER ROLE me CREATEDB;

You can run \du to list all roles/users.

    me          | Create DB                           | {}
    postgres    | Superuser, Create role, Create DB   | {}

Now we want to create a database from the me user. Exit from the default session with \q for quit.

    postgres=# \q

We’re back in our computer’s default Terminal connection. Now we’ll connect postgres with me.

    psql -d postgres -U me

Instead of postgres=#, our prompt shows postgres=> now, meaning we’re no longer logged in as a superuser.
Creating a database in Postgres

We can create a database with the SQL command.

    postgres=> CREATE DATABASE api; 

Use the \list command to see the available databases.

    Name    |    Owner    | Encoding |   Collate   |  Ctype   |
    api     | me          | UTF8     | en_US.UTF-8 | en_US.UTF-8   |

Let’s connect to the new api database with me using the \c (connect) command.

    postgres=> \c api
    You are now connected to database "api" as user "me".
    api=>

Our prompt now displays that we’re connected to api.
Creating a table in Postgres

The last thing we’ll do in the psql command prompt is create a table called users with three fields: two VARCHAR types and an auto-incrementing PRIMARY KEY ID.

    api=>
    CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(30),
    email VARCHAR(30)
    );

    Make sure not to use the backtick (`) character when creating and working with tables in PostgreSQL. While backticks are allowed in MySQL, they’re not valid in PostgreSQL. Also, ensure you do not have a trailing comma in the CREATE TABLE command.

We’ll add two entries to users to have some data to work with.

    INSERT INTO users (name, email)
    VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');

Let’s make sure that got added correctly by getting all entries in users.

    api=> SELECT * FROM users;
    id |  name  |       email        
    ----+--------+--------------------
    1 | Jerry  | jerry@example.com
    2 | George | george@example.com

Now we have a user, database, table, and some data. We can begin building our Node.js RESTful API to connect to this data stored in a PostgreSQL database.

At this point, we’re finished with all of our PostgreSQL tasks, and we can begin setting up our Node.js app and Express server.
Setting up an Express.js server

To set up a Node.js app and Express.js server, create a directory for the project to live in.

    mkdir node-api-postgres
    cd node-api-postgres

You can either run npm init -y to create a package.json, or copy the code below into a package.json file.

    {
    "name": "node-api-postgres",
    "version": "1.0.0",
    "description": "RESTful API with Node.js, Express, and PostgreSQL",
    "main": "index.js",
    "license": "MIT"
    }

We’ll want to install Express.js for the server and node-postgres (pg) to connect to PostgreSQL.

    npm i express pg

Now we have our dependencies loaded into node_modules and package.json.

Create an index.js file, which we’ll use as the entry point for our server. At the top, we’ll require the express module, built in bodyParser middleware, and set our app and port variables.

    const express = require('express')
    const bodyParser = require('body-parser')
    const app = express()
    const port = 3000

    app.use(bodyParser.json())
    app.use(
    bodyParser.urlencoded({
        extended: true,
    })
    )

We’ll tell a route to look for a GET request on the root (/) URL, and return some JSON.

    app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
    })

Now set the app to listen on the port you set.

    app.listen(port, () => {
    console.log(`App running on port ${port}.`)
    })

From the command line, we can start the server by hitting index.js.

    node index.js
App running on port 3000.

Go to http://localhost:3000 in the URL bar of your browser, and you’ll see the JSON we set earlier.

    {
    info: "Node.js, Express, and Postgres API"
    }

The Express server is running now, but it’s only sending some static JSON data that we created. The next step is to connect to PostgreSQL from Node.js to be able to make dynamic queries.
Connecting to a Postgres database from Node.js

We’ll be using the node-postgres module to create a pool of connections. This way we don’t have to open a client and close it every time we make a query.

A popular option for production pooling would be to use pgBouncer, a lightweight connection pooler for PostgreSQL.

Create a file called queries.js and set up the configuration of your PostgreSQL connection.

    const Pool = require('pg').Pool
    const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
    })

In a production environment, you would want to put your configuration details in a separate file with restrictive permissions that is not accessible from version control, but for the simplicity of this tutorial , we’re keeping it in the same file as the queries.

The aim of this tutorial is to allow CRUD operations (GET, POST, PUT, and DELETE) on the API, which will run the corresponding database commands. To do this, we’ll set up a route for each endpoint, and a function corresponding to each query.
Creating routes for CRUD operations

We’re going to create six functions for six routes, as shown below.

First, create all the functions for each route. Then, export the functions so they’re accessible:

    GET — / | displayHome()
    GET — /users | getUsers()
    GET — /users/:id | getUserById()
    POST — users | createUser()
    PUT — /users/:id | updateUser()
    DELETE — /users/:id | deleteUser()

In index.js, we made an app.get() for the root endpoint with a function in it. Now in queries.js, we’ll create endpoints that will display all users, display a single user, create a new user, update an existing user, and delete a user.
GET all users

Our first endpoint will be a GET request. Inside the pool.query() we can put the raw SQL that will touch the api database. We’ll SELECT all users and order by id.

    const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
    }

## GET a single user by ID

For our /users/:id request, we’ll be getting the custom id parameter by the URL and using a WHERE clause to display the result.

In the SQL query, we’re looking for id=$1. In this instance, $1 is a numbered placeholder, which PostgreSQL uses natively instead of the ? placeholder you may be familiar with from other flavors of SQL.

    const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
    }

## POST a new user

<p”>The API will take a GET and POST request to the /users endpoint. In the POST request, we’ll be adding a new user. In this function, we’re extracting the name and email properties from the request body, and INSERTing the values.

    const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
    }

## PUT updated data in an existing user

The /users/:id endpoint will also take two HTTP requests — the GET we created for getUserById, and also a PUT, to modify an existing user. For this query, we’ll combine what we learned in GET and POST to use the UPDATE clause.

It is worth noting that PUT is idempotent, meaning the exact same call can be made over and over and will produce the same result. This is different than POST, in which the exact same call repeated will continuously make new users with the same data.

    const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
        }
    )
    }

## DELETE a user

Finally, we’ll use the DELETE clause on /users/:id to delete a specific user by id. This call is very similar to our getUserById() function.

    const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
    }

Exporting CRUD functions in a REST API

To access these functions from index.js, we’ll need to export them. We can do this with module.exports, creating an object of functions. Since we’re using ES6 syntax, we can write getUsers instead of getUsers:getUsers, and so on.

    module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    }

Here is our complete queries.js file.

    const Pool = require('pg').Pool
    const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
    })
    const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
    }

    const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
    }

    const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
    }

    const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
        }
    )
    }

    const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
    }

    module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    }

### Setting up CRUD functions in a REST API

Now that we have all of our queries, the last thing we need to do is pull them into the index.js file and make endpoint routes for all the query functions we created.

To get all the exported functions from queries.js, we’ll require the file and assign it to a variable.

    const db = require('./queries')

Now for each endpoint, we’ll set the HTTP request method, the endpoint URL path, and the relevant function.

    app.get('/users', db.getUsers)
    app.get('/users/:id', db.getUserById)
    app.post('/users', db.createUser)
    app.put('/users/:id', db.updateUser)
    app.delete('/users/:id', db.deleteUser)

    Here is our complete index.js, the entry point of the API server.

    const express = require('express')
    const bodyParser = require('body-parser')
    const app = express()
    const db = require('./queries')
    const port = 3000

    app.use(bodyParser.json())
    app.use(
    bodyParser.urlencoded({
        extended: true,
    })
    )

    app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
    })

    app.get('/users', db.getUsers)
    app.get('/users/:id', db.getUserById)
    app.post('/users', db.createUser)
    app.put('/users/:id', db.updateUser)
    app.delete('/users/:id', db.deleteUser)

    app.listen(port, () => {
    console.log(`App running on port ${port}.`)
    })

Now with just these two files, we have a server, database, and API all set up. You can start up the server by hitting index.js again.

    node index.js
App running on port 3000.
