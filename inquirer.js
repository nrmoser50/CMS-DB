const inquirer = require("inquirer");
const mySQL = require("mysql2");
require("dotenv").config();

const db = mySQL.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,

    // MySQL password
    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employees_db database.`)
);

// const employees = data
//   .split('\n')
//   .filter(line => line.trim().length > 0)
//   .map(line => {
//     const [id, first_name, last_name, department, role, salary] = line.split(',');
//     return { id: id, name: first_name + last_name, department: department, role: role, salary: salary };
//   });

// const departments = Array.from(new Set(employees.map(emp => emp.department)));
// const roles = Array.from(new Set(employees.map(emp => emp.role)));

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Update Employee Role", value: "updateEmployeeRole" },
          { name: "View All Roles", value: "viewRoles" },
          { name: "Add Role", value: "addRole" },
          { name: "View All Departments", value: "viewDepartments" },
          { name: "Add Department", value: "addDepartment" },
          { name: "View All Employees", value: "viewEmployees" },
          { name: "Add Employee", value: "addEmployee" },
          { name: "Quit", value: "quit" },
        ],
      },
    ])
    .then((answers) => {
      console.log(answers.action);
      switch (answers.action) {
        case "viewDepartments":
          viewDepartments();
          break;
        case "viewRoles":
          viewRoles();
          break;
        case "viewEmployees":
          viewEmployees();
          break;
        case "addRole":
          addRole();
          break;
        case "addDepartment":
          addDepartment();
          break;
        case "addEmployee":
          addEmployee();
          break;
        case "updateEmployeeRole":
          updateEmpRole();
          break;
        case "quit":
          process.exit();
      }
    });
};

const viewDepartments = () => {
  db.promise()
    .query(`SELECT * FROM department`)
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    });
};

const viewRoles = () => {
  db.promise()
    .query(`SELECT * FROM role`)
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    });
};

const viewEmployees = () => {
  db.promise()
    .query(`SELECT * FROM employee`)
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    });
};

const addEmployee = async () => {
  const [roles] = await db.promise().query(`SELECT * FROM role`);
  const rolesArr = roles.map(({ id, title, salary }) => ({
    name: title,
    value: { id, salary },
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: rolesArr,
      },
      {
        type: "list",
        name: "salary",
        message: "What is the salary for this role?",
        choices: rolesArr,
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this role belong to?",
        choices: rolesArr,
      },
    ])
    .then((answers) => {
      const role = answers.role;
      const salary = role.salary;
      const department = answers.department;
      console.log(answers);
      db.promise().query(
        `INSERT INTO employee (role_id, salary, department) VALUES (?,?,?)`,
        [role, salary, department]
      );
      mainMenu();
    });
};

const addRole = async () => {
  const [departments] = await db.promise().query(`SELECT * FROM department`);
  const departmentArr = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "title",
        message: "What is the employee's role?",
        choices: departmentArr,
      },
    ])
    .then((answers) => {
      console.log(answers);
      mainMenu();
    });
};

const addDepartment = async () => {
  const [employee] = await db.promise().query(`SELECT * FROM department`);
  const employeeArr = employee.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the department?",
        choices: employeeArr,
      },
    ])
    .then((answers) => {
      const { title } = answers;
      db.promise().query(`INSERT INTO department (name) VALUES (?)`, [title]);
      console.log(`Added "${title} to the database."`);
      mainMenu();
    });
};

mainMenu();
