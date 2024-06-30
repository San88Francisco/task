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
      } else {
        console.error('Skipping incomplete transaction:', transaction);
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

    if (transactions && Array.isArray(transactions)) {
      const tableName = `transactions_${uuidv4().replace(/-/g, '_')}`;
      createTable(tableName);
      insertTransactions(tableName, transactions);
      res.send(`Data successfully saved to table ${tableName}.`);
    } else {
      res.status(400).send('Invalid data.');
    }
  } catch (error) {
    console.error('Error handling /uploads request:', error);
    res.status(500).send('Internal server error.');
  }
});

app.get('/transactions/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  try {
    const transactions = db.prepare(`SELECT * FROM ${tableName}`).all();
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving data from table:', error);
    res.status(500).send('Error retrieving data from table.');
  }
});

app.get('/all-tables', (req, res) => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name LIKE 'transactions_%'
    `).all();
    const tableNames = tables.map(table => table.name);
    res.json(tableNames);
  } catch (error) {
    console.error('Error retrieving table list:', error);
    res.status(500).send('Error retrieving table list.');
  }
});

app.delete('/transactions/:tableName/:transactionId', (req, res) => {
  const { tableName, transactionId } = req.params;

  try {
    const deleteStmt = db.prepare(`DELETE FROM ${tableName} WHERE TransactionId = ?`);
    deleteStmt.run(transactionId);

    const remainingTransactions = db.prepare(`SELECT * FROM ${tableName}`).all();

    if (remainingTransactions.length === 0) {
      const dropTableStmt = db.prepare(`DROP TABLE ${tableName}`);
      dropTableStmt.run();
      res.send(`Transaction with ID ${transactionId} successfully deleted. Table \`${tableName}\` deleted as it is empty.`);
    } else {
      let newIndex = 1;
      const updateStmt = db.prepare(`UPDATE ${tableName} SET TransactionId = ? WHERE TransactionId = ?`);
      remainingTransactions.forEach(transaction => {
        updateStmt.run(newIndex++, transaction.TransactionId);
      });

      res.send(`Transaction with ID ${transactionId} successfully deleted and identifiers updated.`);
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send('Error deleting transaction.');
  }
});


app.patch('/transactions/:tableName/:transactionId', (req, res) => {
  const { tableName, transactionId } = req.params;
  const { amount, clientName, status, type } = req.body;

  try {
    if (!transactionId || (!amount && !clientName && !status && !type)) {
      return res.status(400).send('Invalid request.');
    }

    const updateFields = [];
    const updateParams = [];

    if (amount) {
      updateFields.push('Amount = ?');
      updateParams.push(amount);
    }
    if (clientName) {
      updateFields.push('ClientName = ?');
      updateParams.push(clientName);
    }
    if (status) {
      updateFields.push('Status = ?');
      updateParams.push(status);
    }
    if (type) {
      updateFields.push('Type = ?');
      updateParams.push(type);
    }

    const sql = `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE TransactionId = ?`;
    const updateStmt = db.prepare(sql);
    updateParams.push(transactionId);

    updateStmt.run(...updateParams);

    const updatedTransaction = db.prepare(`SELECT * FROM ${tableName} WHERE TransactionId = ?`).get(transactionId);
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).send('Error updating transaction.');
  }
});


const port = 1000;
app.listen(port, () => {
});
