-- виділити, права кн, run selected query

CREATE TABLE users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER
)

-- додати нове поле
INSERT INTO users(name, age)
VALUES('Pedro', 27)

-- зміна даних
UPDATE users 
SET name = 'John2'
WHERE name = 'John'

-- видалення
DELETE FROM users 
WHERE name = 'Pedro'

-- пошук конкретних параметрів (якщо перша стрічка лише, то пошук стовпців)
SELECT name FROM users
WHERE id = 2

-- видаляєм всю базу 
DROP TABLE transactions_b71d8897_0eef_44d3_bd78_088e53edbea3

-- дроп всієї бд (без видалення бд)
PRAGMA writable_schema = 1;

DELETE FROM sqlite_master 
WHERE type = 'table' AND name LIKE 'transactions_%';

PRAGMA writable_schema = 0;
VACUUM;
