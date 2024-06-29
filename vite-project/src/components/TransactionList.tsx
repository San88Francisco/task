import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Flex } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteTransaction, fetchTransactions } from '../api/api';
import { ModalCustom } from "./ModalCustom";
import { buttonStyles } from "./DownloadCSV";

export type Transaction = {
  TransactionId: number;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: number;
};

type PropsType = {
  selectedTable: string | null;
  setDownloadArray: Dispatch<SetStateAction<Transaction[]>>;
};


const tableStyles = {
  height: 480,
  borderRadius: 20,
  borderTop: '20px solid #c1e2a4',
  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
  fontFamily: 'Roboto',
  color: '#1C2621',
  p: 15,
  m: '40px 15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const tableBtn = {
  p: 10,
  borderRadius: 15,
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px',
  transition: 'all 0.1s ease',
  "&:hover": {
    bg: "#fdfdfd",
  },
}

export const LoadingTransactions: FC<PropsType> = ({ selectedTable, setDownloadArray }) => {
  const queryClient = useQueryClient();

  const { data: transactions } = useQuery(
    ['transactions', selectedTable],
    () => fetchTransactions(selectedTable!),
    {
      enabled: !!selectedTable,
      onSuccess: (data) => {
        if (data) {
          setDownloadArray(data);
        }
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );

  const { mutate: deleteTransactionMutation } = useMutation(
    ({ tableName, transactionId }: { tableName: string, transactionId: number }) => deleteTransaction(tableName, transactionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions', selectedTable]);
      },
      onError: (error: Error) => {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction.');
      },
    }
  );

  const [pageNumber, setPageNumber] = useState(0);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setPageNumber(0);
  }, [transactions]);

  const handleEditClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setOpenModal(true);
  };

  const handleDeleteClick = (transactionId: number) => {
    if (selectedTable) {
      deleteTransactionMutation({ tableName: selectedTable, transactionId });
    }
  };

  const transactionsPerPage = 10;
  const pageCount = transactions ? Math.ceil(transactions.length / transactionsPerPage) : 1;

  const displayData = transactions
    ? transactions.slice(pageNumber * transactionsPerPage, (pageNumber + 1) * transactionsPerPage)
    : [];

  if (!selectedTable) return null;

  return (
    <>
      <Box sx={tableStyles}>
        <Table variant="simple" width="100%">
          <Thead>
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
            {displayData.map((transaction: Transaction) => (
              <Tr key={transaction.TransactionId} textAlign="center">
                <Td>{transaction.TransactionId}</Td>
                <Td>{transaction.Status}</Td>
                <Td>{transaction.Type}</Td>
                <Td>{transaction.ClientName}</Td>
                <Td>{transaction.Amount}</Td>
                <Td>
                  <Button
                    sx={tableBtn}
                    onClick={() => handleEditClick(transaction.TransactionId)}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={tableBtn}
                    onClick={() => handleDeleteClick(transaction.TransactionId)}
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
        </Table >

        <Flex mt={20} justifyContent="flex-end" pr={4} gap={10}>
          <Button
            sx={buttonStyles}
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 0))}
            disabled={pageNumber === 0}
            mr={2}
            opacity={pageNumber === 0 ? 0.5 : 1}
          >
            Previous
          </Button>
          <Button
            sx={buttonStyles}
            onClick={() => setPageNumber(prev => Math.min(prev + 1, pageCount - 1))}
            disabled={pageNumber === pageCount - 1}
            opacity={pageNumber === pageCount - 1 ? 0.5 : 1}
          >
            Next
          </Button>
        </Flex>
      </Box >
      <ModalCustom
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedTable={selectedTable}
        selectedTransactionId={selectedTransactionId}
        setSelectedTransactionId={setSelectedTransactionId}
        transactions={transactions}
      />
    </>
  );
};
