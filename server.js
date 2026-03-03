const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


// DATABASE
// ////////

const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'loanstreetTestDB',
    user: 'postgres',
    password: 'OpOChpmcPs5gEN4w',
})

// TODO: Connection Pooling
client.connect(null, (err) => {
    console.log(err)
})



// SERVER
// //////

const app = express()
const port = 3000
const swagger_options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loanstreet Loan API',
            version: '1.0.0',
        },
    },
    apis: ['./index.js'], // files containing annotations as above
};

// Middleware to parse JSON bodies (for "Content-Type: application/json")
// TODO: More dynamic routing and endpoint versioning
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swagger_options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /create:
 *   post:
 *     description: Create a new loan
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   amount: { type: float, example: 2000.01 }
 *                   interest_rate: { type: float, example: 0.03 }
 *                   length: { type: integer, example: 36 }
 *                   payment_amount: { type: float, example: 401.36 }
 *     responses:
 *       200:
 *         description: Loan created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 */
app.post('/create', async (request, response) => {
    // TODO: Error handling / input validation
    const query = `INSERT INTO loans (amount, interest_rate, length_in_months, monthly_payment_amount)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id`
    console.log(request.body)
    const result = await client.query(query, [
        parseInt(request.body.data.amount * 100),
        request.body.data.interest_rate,
        request.body.data.length,
        parseInt(request.body.data.payment_amount * 100),
    ])
    response.send(result.rows[0])
})


/**
 * @swagger
 * /read/{id}:
 *   get:
 *     description: Read information on a loan
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer, example: 1 }
 *         required: true
 *     responses:
 *       200:
 *         description: Loan information fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     amount: { type: float, example: 2000.00 }
 *                     interest_rate: { type: float, example: 0.03 }
 *                     length: { type: integer, example: 36 }
 *                     payment_amount: { type: float, example: 400.00 }
 */
app.get('/read/:id', async (request, response) => {
    // TODO: Error handling
    console.log(`id: ${request.params.id}`)
    const result = await client.query('SELECT * FROM loans WHERE id = $1', [request.params.id] )
    response.send({
        id: result.rows[0].id,
        amount: result.rows[0].amount / 100.0,
        interest_rate: parseInt(result.rows[0].interest_rate),
        length: result.rows[0].length_in_months,
        payment_amount: result.rows[0].monthly_payment_amount / 100.0,
    })
})


/**
 * @swagger
 * /update/{id}:
 *   post:
 *     description: Update information about a loan
 *     responses:
 *       200:
 *         description: Loan information updated successfully.
 */
app.post('/update/:id', async (request, response) => {
    // TODO: Error handling
    const result = await client.query('SELECT version()')
    console.log(result.rows[0].version)
    response.send('Hello World!')
})


app.listen(port, () => {
    console.log('Server running on port ' + port)
})

process.on('beforeExit', async () => {
    await client.end()
})