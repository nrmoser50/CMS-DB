SELECT *
FROM department
JOIN role ON department.role = department.id
JOIN employee ON employee.role = role.id;