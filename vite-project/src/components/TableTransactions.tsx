import { FC } from 'react';
import { Heading, List, ListItem, Text, Box } from '@chakra-ui/react';

type Transaction = {
  TransactionId: number;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: number;
}

type PropsType = {
  data: Transaction[];
}

export const TableTransactions: FC<PropsType> = ({ data }) => {
  return (
    <Box mt={4}>
      <Heading size="lg">Transactions</Heading>
      <List mt={2}>
        {data.map(transaction => (
          <ListItem key={transaction.TransactionId}>
            <Text>
              <strong>Status:</strong> {transaction.Status},{' '}
              <strong>Type:</strong> {transaction.Type},{' '}
              <strong>Client:</strong> {transaction.ClientName},{' '}
              <strong>Amount:</strong> {transaction.Amount}
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

