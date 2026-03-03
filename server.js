const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { Client } = require('pg')


// DATABASE
// ////////
const client = new Client(require('./db_config.json'))

// TODO: Connection Pooling
client.connect(null, (err) => { console.log(err) })


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
    apis: ['./server.js'], // files containing annotations as above
};

// Middleware to parse JSON bodies (for "Content-Type: application/json")
app.use(express.json());

// Setup swagger for easier testing
const swaggerSpec = swaggerJsdoc(swagger_options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// TODO: More dynamic routing and endpoint versioning

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
        interest_rate: parseFloat(result.rows[0].interest_rate),
        length: result.rows[0].length_in_months,
        payment_amount: result.rows[0].monthly_payment_amount / 100.0,
    })
})


/**
 * @swagger
 * /update/{id}:
 *   post:
 *     description: Update information about a loan
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer, example: 1 }
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   amount: { type: float, example: 2040.01 }
 *                   interest_rate: { type: float, example: 0.06 }
 *                   length: { type: integer, example: 24 }
 *                   payment_amount: { type: float, example: 421.36 }
 *     responses:
 *       200:
 *         description: Loan information updated successfully.
 */
app.post('/update/:id', async (request, response) => {
    // TODO: Error handling
    // TODO: We probably don't want to make an extra round trip to the DB, but this is the easy way to avoid extra logic for now.
    const existing_values = await client.query('SELECT * FROM loans WHERE id = $1', [request.params.id] )
    const query = `UPDATE loans
                   SET amount = $2, interest_rate = $3, length_in_months = $4, monthly_payment_amount = $5
                   WHERE id = $1`
    await client.query(query, [
        request.params.id,
        request.body.data.amount ? parseInt(request.body.data.amount * 100) : existing_values.rows[0].amount,
        request.body.data.interest_rate ?? existing_values.rows[0].interest_rate,
        request.body.data.length ?? existing_values.rows[0].length_in_months,
        request.body.data.payment_amount ? parseInt(request.body.data.payment_amount * 100) : existing_values.rows[0].monthly_payment_amount,
    ])
    response.send('Loan information updated successfully.')
})


app.listen(port, () => {
    console.log('Server running on port ' + port)
})

process.on('beforeExit', async () => {
    await client.end()
})