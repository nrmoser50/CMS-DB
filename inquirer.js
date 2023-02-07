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
  const roleArr = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const [employees] = await db.promise().query(`SELECT * FROM employee`);
  const employeeArr = employees.map(
    ({ first_name, last_name, role_id, manager_id }) => ({
      name: `${first_name} ${last_name}`,
      value: { first_name, last_name, role_id, manager_id },
    })
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roleArr,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: employeeArr,
      },
    ])
    .then((answers) => {
      const { first_name, last_name, role_id, manager_id } = answers;
      // console.log(answers);
      db.promise().query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`[
          (first_name, last_name, role_id, manager_id)
        ]
      );

      console.log(`Added "${first_name} ${last_name}" to the database."`);
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
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "what is the salary of this role?",
      },
      {
        type: "list",
        name: "department",
        message: "What department does this role belong to?",
        choices: departmentArr,
      },
    ])
    .then((answers) => {
      const { title, salary, department } = answers;
      db.promise()
        .query(
          `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
          [title, salary, department]
        )
        .then(() => {
          console.log(`Added "${title}" role to the database.`);
          mainMenu();
        })
        .catch((error) => {
          console.error(error);
          console.log(
            "An error occurred while adding the role to the database."
          );
          mainMenu();
        });
    });
};

const addDepartment = async () => {
  // const [employee] = await db.promise().query(`SELECT * FROM department`);
  // const employeeArr = employee.map(({ id, name }) => ({
  //   name: name,
  //   value: id,
  // }));
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const { title } = answers;
      db.promise().query(`INSERT INTO department (name) VALUES (?)`, [title]);
      console.log(`Added "${title} to the database."`);
      mainMenu();
    })
    .catch((error) => {
      console.error(error);
      console.log(`An error occurred while adding "${title}" to the database`)
      mainMenu();
    })
};

const updateEmpRole = async () => {
  const [employees] = await db.promise().query(`SELECT * FROM employee`);
  const employeeArr = employees.map(
    ({ id, first_name, last_name, role_id, manager_id }) => ({
      name: `${first_name} ${last_name}`,
      value: { id, first_name, last_name, role_id, manager_id },
    })
  );
  const [roles] = await db.promise().query(`SELECT * FROM role`);
  const roleArr = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role would you like to update?",
        choices: employeeArr,
      },
      {
        type: "list",
        name: "role",
        message: "What is the new role?",
        choices: roleArr,
      },
    ])
    .then((answers) => {
      const { employee } = answers;
      const role = answers.role;
      db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [
        role,
        employee.id,
      ]);
      console.log(
        `Updated "${employee.first_name} ${employee.last_name}" role to "${role}" in the database."`
      );
      mainMenu();
    });
};

mainMenu();
