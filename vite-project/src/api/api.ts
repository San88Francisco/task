import axios from 'axios';
import Papa from 'papaparse';

const API_BASE_URL = 'http://localhost:1000';

export const getTableAll = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-tables`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tables:', error);
    throw new Error('Error fetching all tables');
  }
};

export const uploadFile = async (file: File) => {
  try {
    const results = await new Promise<any>((resolve) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results),
        error: (error) => {
          console.error('Error parsing CSV file:', error);
          alert('Error parsing CSV file.');
        }
      });
    });

    console.log('Parsed CSV data:', results.data);

    const response = await axios.post(`${API_BASE_URL}/uploads`, results.data);
    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to upload file');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};

export const fetchTransactions = async (transaction: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/${transaction}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for ${transaction}:`, error);
    throw new Error(`Error fetching transactions for ${transaction}`);
  }
};

export const deleteTransaction = async (tableName: string, transactionId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/transactions/${tableName}/${transactionId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Deleted transaction:', response.data);

  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Error deleting transaction');
  }
};

export const updateTransactionClient = async (tableName: string, transactionId: number, data: any) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/transactions/${tableName}/${transactionId}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Updated transaction:', response.data);

  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Error updating transaction');
  }
};
