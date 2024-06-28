import { FC, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Flex } from "@chakra-ui/react";
import { Transaction } from "./LoadingTransactions";



type PropsType = {
  data: Transaction[];
  onDeleteTransaction: (transactionId: number) => void;
}

export const TransactionList: FC<PropsType> = ({ data, onDeleteTransaction }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const transactionsPerPage = 10;
  const pageCount = Math.ceil(data.length / transactionsPerPage);

  const displayData = data.slice(pageNumber * transactionsPerPage, (pageNumber + 1) * transactionsPerPage);

  return (
    <Box mt={40} >
      <Table variant="simple" width="100%">
        <Thead sx={{ bg: "#bfbfbf" }}>
          <Tr>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>Type</Th>
            <Th>Client</Th>
            <Th>Amount</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayData.map(transaction => (
            <Tr key={transaction.TransactionId} textAlign="center" bg="#f2f2f2">
              <Td>{transaction.TransactionId}</Td>
              <Td>{transaction.Status}</Td>
              <Td>{transaction.Type}</Td>
              <Td>{transaction.ClientName}</Td>
              <Td>{transaction.Amount}</Td>
              <Td>
                <Button>Edit</Button>
                <Button
                  onClick={() => onDeleteTransaction(transaction.TransactionId)}
                  variant="outline"
                  colorScheme="red"
                  ml={2}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt={20} justifyContent="flex-end" pr={4}>
        <Button
          sx={{
            p: "10px 15px",
            border: "1px solid",
            borderRadius: 17,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bg: "#f2f2f2",
            }
          }}
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 0))}
          disabled={pageNumber === 0}
          mr={2}
          opacity={pageNumber === 0 ? 0.5 : 1}
        >
          Previous
        </Button>
        <Button
          sx={{
            p: "10px 15px",
            border: "1px solid",
            borderRadius: 17,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bg: "#f2f2f2",
            }
          }}
          onClick={() => setPageNumber(prev => Math.min(prev + 1, pageCount - 1))}
          disabled={pageNumber === pageCount - 1}
          opacity={pageNumber === pageCount - 1 ? 0.5 : 1}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};
