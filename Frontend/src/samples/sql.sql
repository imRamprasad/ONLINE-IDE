-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Insert data into users
INSERT INTO users VALUES (1, 'Alice', 'alice@example.com');
INSERT INTO users VALUES (2, 'Bob', 'bob@example.com');

-- Show all users
SELECT * FROM users;


-- Create emp table
CREATE TABLE emp (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    job VARCHAR(50),
    salary INT
);

-- Insert sample employee data
INSERT INTO emp VALUES (101, 'John', 'SALESMAN', 3000);
INSERT INTO emp VALUES (102, 'David', 'MANAGER', 5000);
INSERT INTO emp VALUES (103, 'Smith', 'SALESMAN', 3200);

-- Select all employees who are SALESMAN
SELECT * FROM emp WHERE job = 'SALESMAN';
