import axios from 'axios';
import Papa from 'papaparse';

export const fetchTransactions = async () => {
  return (await axios.get('http://localhost:1000/transactions/transactions_caf02c1b_52bb_42fe_bb33_d0e3609f2f38')).data;
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

    const response = await axios.post('http://localhost:1000/uploads', results.data);
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
