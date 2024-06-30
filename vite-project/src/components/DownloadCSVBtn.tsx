import { FC } from 'react';
import { saveAs } from 'file-saver';
import { Transaction } from './TransactionList';
import { StyledButton } from '../styles/style';

type PropsType = {
  downloadArray: Transaction[];
};

const header = ['TransactionId', 'Status', 'Type', 'ClientName', 'Amount'];

const generateCsvContent = (transactions: Transaction[]): string => {
  const rows = transactions.map(({ TransactionId, Status, Type, ClientName, Amount }) =>
    [TransactionId, Status, Type, ClientName, Amount].join(','),
  );
  return [header.join(','), ...rows].join('\n');
};

export const DownloadCSVBtn: FC<PropsType> = ({ downloadArray }) => {
  const downloadCsv = () => {
    const csvContent = generateCsvContent(downloadArray);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  return <StyledButton onClick={downloadCsv}>Download CSV</StyledButton>;
};
