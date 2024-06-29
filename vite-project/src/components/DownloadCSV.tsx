import { FC } from 'react';
import { Button } from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import { Transaction } from './TransactionList';

type PropsType = {
  downloadArray: Transaction[];
};

export const buttonStyles = {
  p: "10px 15px",
  border: "none",
  borderRadius: 17,
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
  "&:hover": {
    bg: "#fdfdfd",
  },
};

const generateCsvContent = (transactions: Transaction[]): string => {
  const header = "TransactionId,Status,Type,ClientName,Amount";
  const rows = transactions.map((transaction) =>
    `${transaction.TransactionId},${transaction.Status},${transaction.Type},${transaction.ClientName},${transaction.Amount}`
  );
  return [header, ...rows].join("\n");
};

export const DownloadCSV: FC<PropsType> = ({ downloadArray }) => {
  const downloadCsv = () => {
    const csvContent = generateCsvContent(downloadArray);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  return (
    <Button
      sx={buttonStyles}
      onClick={downloadCsv}
    >
      Download CSV
    </Button>
  );
};
