CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    amount BIGINT NOT NULL,
    interest_rate NUMERIC NOT NULL,
    length_in_months INTEGER NOT NULL,
    monthly_payment_amount BIGINT NOT NULL
);