import express from 'express';
import sqlite3 from 'better-sqlite3';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const dbFile = './server/database.db';
const db = sqlite3(dbFile);

const createTable = (tableName) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      TransactionId INTEGER PRIMARY KEY AUTOINCREMENT,
      Status TEXT NOT NULL,
      Type TEXT NOT NULL,
      ClientName TEXT NOT NULL,
      Amount REAL NOT NULL
    )
  `;
  db.exec(sql);
  console.log(`Таблицю \`${tableName}\` створено або вже існує.`);
};

const insertTransactions = (tableName, transactions) => {
  const insert = db.prepare(`
    INSERT INTO ${tableName} (Status, Type, ClientName, Amount)
    VALUES (?, ?, ?, ?)
  `);

  const transactionWrapper = db.transaction((transactions) => {
    transactions.forEach(transaction => {
      if (transaction.Status && transaction.Type && transaction.ClientName && transaction.Amount) {
        const { Status, Type, ClientName } = transaction;
        const Amount = parseFloat(transaction.Amount.replace('$', '').replace(',', ''));
        insert.run(Status, Type, ClientName, Amount);
        console.log(`Вставлено транзакцію у ${tableName}: ${JSON.stringify(transaction)}`);
      } else {
        console.error('Пропускаю неповну транзакцію:', transaction);
      }
    });
  });

  transactionWrapper(transactions);
};

app.use(express.json());
app.use(cors());

app.post('/uploads', (req, res) => {
  try {
    const transactions = req.body;
    console.log('Отримані транзакції:', transactions);

    if (transactions && Array.isArray(transactions)) {
      const tableName = `transactions_${uuidv4().replace(/-/g, '_')}`;
      createTable(tableName);
      insertTransactions(tableName, transactions);
      res.send(`Дані успішно збережено у таблиці ${tableName}.`);
    } else {
      res.status(400).send('Некоректні дані.');
    }
  } catch (error) {
    console.error('Помилка обробки запиту /uploads:', error);
    res.status(500).send('Внутрішня помилка сервера.');
  }
});

app.get('/transactions/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  try {
    const transactions = db.prepare(`SELECT * FROM ${tableName}`).all();
    res.json(transactions);
  } catch (error) {
    console.error('Помилка отримання даних з таблиці:', error);
    res.status(500).send('Помилка при отриманні даних з таблиці.');
  }
});

const port = 1000;
app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
