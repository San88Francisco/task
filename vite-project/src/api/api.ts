import axios from "axios";
import Papa, { ParseResult } from "papaparse";
import { Transaction } from '../components/TransactionList';
import { buildUrl } from "../axios/axios";



export const getTableAll = async () => {
  try {
    const response = await axios.get(buildUrl('/all-tables'));
    return response.data;
  } catch (error) {
    console.error('Error fetching all tables:', error);
    throw new Error('Error fetching all tables');
  }
};

export const uploadFile = async (file: File) => {
  try {
    const results: ParseResult<Transaction> = await new Promise((resolve) => {
      Papa.parse<Transaction>(file, {
        header: true,
        complete: (results) => resolve(results),
        error: (error) => {
          console.error('Error parsing CSV file:', error);
          alert('Error parsing CSV file.');
        }
      });
    });

    await axios.post(buildUrl('/uploads'), results.data);

  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};

export const fetchTransactions = async (transaction: string) => {
  try {
    const response = await axios.get(buildUrl(`/transactions/${transaction}`));
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for ${transaction}:`, error);
    throw new Error(`Error fetching transactions for ${transaction}`);
  }
};

export const deleteTransaction = async (tableName: string, transactionId: number) => {
  try {
    await axios.delete(buildUrl(`/transactions/${tableName}/${transactionId}`), {
      headers: {
        'Content-Type': 'application/json'
      }
    });


  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Error deleting transaction');
  }
};

export const updateTransactionClient = async (tableName: string, transactionId: number, data: Transaction) => {
  try {
    await axios.patch(buildUrl(`/transactions/${tableName}/${transactionId}`), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });


  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Error updating transaction');
  }
};
