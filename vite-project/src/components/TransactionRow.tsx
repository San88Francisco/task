import { FC } from 'react';
import { Td, Tr } from '@chakra-ui/react';
import { Transaction } from './TransactionList';
import { TableButton } from '../styles/style';

type TransactionRowProps = {
  transaction: Transaction;
  onEdit: (transactionId: number) => void;
  onDelete: (transactionId: number) => void;
};

export const TransactionRow: FC<TransactionRowProps> = ({ transaction, onEdit, onDelete }) => {
  const { TransactionId, Status, Type, ClientName, Amount } = transaction;

  return (
    <Tr textAlign="center">
      <Td>{TransactionId}</Td>
      <Td>{Status}</Td>
      <Td>{Type}</Td>
      <Td>{ClientName}</Td>
      <Td>{Amount}</Td>
      <Td>
        <TableButton onClick={() => TransactionId && onEdit(TransactionId)}>Edit</TableButton>
        <TableButton onClick={() => TransactionId && onDelete(TransactionId)}>Delete</TableButton>
      </Td>
    </Tr>
  );
};
