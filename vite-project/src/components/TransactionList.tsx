import { FC, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Flex, Box } from '@chakra-ui/react';
import { useSortedTransactions } from '../utils/useSortedTransactions';
import { TransactionRow } from './TransactionRow';
import useDeleteTransactionMutation from '../hooks/mutations/useDeleteTransactionMutation';
import { ModalCustom } from './ModalCustom';
import { StyledButton, TableContainer } from '../styles/style';

export type Transaction = {
  TransactionId?: number;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: number;
};

type PropsType = {
  selectedTable: string | null;
  setDownloadArray: (data: Transaction[]) => void;
};

const tableHeaders = [
  { label: 'ID', type: 'TransactionId' },
  { label: 'Status', type: 'Status' },
  { label: 'Type', type: 'Type' },
  { label: 'Client', type: 'ClientName' },
  { label: 'Amount', type: 'Amount' },
  { label: 'Action', type: 'Action' },
];

export const LoadingTransactions: FC<PropsType> = ({ selectedTable, setDownloadArray }) => {
  const { deleteTransactionMutation } = useDeleteTransactionMutation();

  const { displayData, pageNumber, pageCount, handleSortClick, setPageNumber, transactions } =
    useSortedTransactions(selectedTable, setDownloadArray);

  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleEditClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setOpenModal(true);
  };

  const handleDeleteClick = (transactionId: number) => {
    if (selectedTable) {
      deleteTransactionMutation({ tableName: selectedTable, transactionId });
    }
  };

  if (!selectedTable) return null;

  return (
    <>
      <TableContainer>
        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              {tableHeaders.map(header => (
                <Th key={header.type} cursor="pointer" onClick={() => handleSortClick(header.type)}>
                  {header.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {displayData.map((transaction: Transaction) => (
              <TransactionRow
                key={transaction.TransactionId}
                transaction={transaction}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </Tbody>
        </Table>
        <Flex mt={20} justifyContent="flex-end" pr={4} gap={10}>
          <Box sx={{ m: 10 }}>
            {pageNumber + 1}/{pageCount}
          </Box>
          <StyledButton
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 0))}
            disabled={pageNumber === 0}
          >
            Previous
          </StyledButton>
          <StyledButton
            onClick={() => setPageNumber(prev => Math.min(prev + 1, pageCount - 1))}
            disabled={pageNumber === pageCount - 1}
          >
            Next
          </StyledButton>
        </Flex>
      </TableContainer>
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
