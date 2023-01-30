const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'MrMeowMeow23!',
    database: 'employees_db'
  }, 
    console.log(`Connected to the employees_db database.`)
  );

db.query(`SELECT * FROM employees`, (err, results) => {
    console.log(results)
});

app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  })
