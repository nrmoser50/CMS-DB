INSERT INTO department (id, name)
VALUES (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal"),
       (1, "Sales"),

INSERT INTO role (id, title, department, salary)
VALUES (1, "Sales Lead", "Sales", 100000),
       (2, "Salesperson", "Sales", 80000),
       (3, "Lead Engineer", "Engineering", 150000),
       (4, "Software Engineer", "Engineering", 120000),
       (5, "Account Manager", "Finance", 160000),
       (6, "Accountant", "Finance", 125000),
       (7, "Legal Team Lead", "Legal", 250000),
       (8, "Lawyer", "Legal", 190000)

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, NULL),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, NULL),
       (4, "Kevin", "Tupik", 4, 3),
       (5, "Kunal", "Singh", 5, NULL),
       (6, "Malia", "Brown", 6, 5),
       (7, "Sarah", "Lourd", 7, NULL),
       (8, "Tom", "Allen", 8, 7)