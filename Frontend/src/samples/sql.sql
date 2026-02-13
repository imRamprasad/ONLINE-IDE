-- SQL basic template
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users VALUES (1, 'Alice', 'alice@example.com');
INSERT INTO users VALUES (2, 'Bob', 'bob@example.com');

SELECT * FROM users;

-- Select all employees who are SALESMAN from the emp table
SELECT * FROM emp WHERE job = 'SALESMAN';
