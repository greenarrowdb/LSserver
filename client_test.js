const client = require('./client')
const assert = require("node:assert");


async function simple_test() {
    const loanId1 = await client.create_loan(3001, 0.04, 32, 600.10)
    console.log(loanId1)

    const loanDetails1 = await client.read_loan(loanId1)
    console.log(loanDetails1)
    assert.equal(loanDetails1.amount,  3001)
    assert.equal(loanDetails1.interest_rate,  0.04)
    assert.equal(loanDetails1.length,  32)
    assert.equal(loanDetails1.payment_amount,  600.10)


    await client.update_loan(loanId1, { interest_rate: 0.5, payment_amount: 50 })
    const modifiedLoanDetails1 = await client.read_loan(loanId1)
    console.log(modifiedLoanDetails1)
    assert.equal(loanDetails1.amount,  3001)
    assert.equal(modifiedLoanDetails1.interest_rate, 0.5)
    assert.equal(loanDetails1.length,  32)
    assert.equal(modifiedLoanDetails1.payment_amount,  50)
}

simple_test().then(() => console.log('DONE'))