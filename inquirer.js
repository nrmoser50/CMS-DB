const inquirer = require('inquirer');
const fs = require('fs');

fs.readFile('db/seeds.sql', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const employees = data
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      const [id, first_name, last_name, department, role, salary] = line.split(',');
      return { id: id, name: first_name + last_name, department: department, role: role, salary: salary };
    });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const roles = Array.from(new Set(employees.map(emp => emp.role)));

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Update Employee Role', value: 'updateEmployeeRole' },
          { name: 'View All Roles', value: 'viewRoles' },
          { name: 'Add Role', value: 'addRole' },
          { name: 'View All Departments', value: 'viewDepartments' },
          { name: 'Add Department', value: 'addDepartment' },
          { name: 'View All Employees', value: 'viewEmployees' },
          { name: 'Add Employee', value: 'addEmployee' },
          { name: 'Quit', value: 'quit' },
          { name: 'View All Employees', value: 'viewEmployees' },
          
          
        ],
      },
    ])
    .then(answers => {
        switch (answers.action) {
        case 'updateEmployeeRole':
          console.log('Update Employee Role');
          break;

        case 'viewEmployees':
          console.log('All Employees:');
          employees.forEach(emp => {
            console.log(`- ${emp.name} (${emp.position})`);
          });
          break;
        case 'viewDepartments':
          console.log('All Departments:');
          departments.forEach(dep => {
            console.log(`- ${dep}`);
          });
          break;
        case 'viewRoles':
          console.log('All Roles:');
          roles.forEach(role => {
            console.log(`- ${role}`);
          });
          break;
        case 'addRole':
            inquirer
            .prompt([
                {
                  type: 'input',
                  name: 'newRole',
                  message: 'Enter the new role'
                }  
                ])
      }
    });
});




