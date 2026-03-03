
// TODO: package as an npm module
// TODO: bake the url into the package in some intelligent way:
const API_URL_BASE = 'http://localhost:3000'


/**
 * Creates a new loan.
 *
 * @param {number} amount - Total amount for the loan
 * @param {number} interest_rate - The loan's interest rate
 * @param {number} length - Lifetime of the loan (in months)
 * @param {number} payment_amount - Monthly payment amount
 *
 * @returns {Promise<number>} id: Id of the loan created
 */
export async function create_loan(amount, interest_rate, length, payment_amount) {
    // TODO: Error handling
    // TODO: Input validation
    const data = { amount, interest_rate, length, payment_amount };

    const response = await fetch(`${API_URL_BASE}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data}),
    });

    const result = await response.json();
    return(result.id);
}


/**
 * Reads and returns information on a loan.
 *
 * @param {number} id - id of loan to read
 *
 * @returns {Promise<object>} Map containing details about the loan
 */
export async function read_loan(id) {
    // TODO: Error handling
    // TODO: Input validation
    const response = await fetch(`${API_URL_BASE}/read/${id}`);
    const result = await response.json();
    return(result);
}


/**
 * Updates information on a loan.
 *
 * @param {number} id - id of loan to update
 * @param {object} data - object containing any of:
 *       amount - Total amount for the loan
 *       interest_rate - The loan's interest rate
 *       length - Lifetime of the loan (in months)
 *       payment_amount - Monthly payment amount
 *
 * @returns {Promise<void>}
 */
export async function update_loan(id, data) {
    // TODO: Error handling
    // TODO: Input validation: data specifically can be abused in a number of ways.
    await fetch(`${API_URL_BASE}/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data}),
    });
}
