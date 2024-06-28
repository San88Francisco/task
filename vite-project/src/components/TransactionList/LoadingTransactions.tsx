import { FC } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { TransactionList } from './TransactionList';

export type Transaction = {
  TransactionId: number;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: number;
}

type LoadingTransactionsProps = {
  isTransactionsLoading: boolean;
  isTransactionsError: boolean;
  selectedTable: string | null;
  transactionsData: Transaction[];
  onDeleteTransaction: (transactionId: number) => void;
};

export const LoadingTransactions: FC<LoadingTransactionsProps> = ({
  isTransactionsLoading,
  isTransactionsError,
  selectedTable,
  transactionsData,
  onDeleteTransaction
}) => {

  if (isTransactionsLoading) {
    return <p>Loading transactions...</p>;
  }

  if (isTransactionsError) {
    return (
      <Alert status="error" mt={4} variant="left-accent">
        <AlertIcon />
        <AlertTitle>Error fetching transactions</AlertTitle>
      </Alert>
    );
  }

  return selectedTable && <TransactionList data={transactionsData} onDeleteTransaction={onDeleteTransaction} />;
};

