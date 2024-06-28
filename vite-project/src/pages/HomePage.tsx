import { useState, useEffect } from "react";
import { Box, Container } from "@chakra-ui/react";
import { ImportBtn } from "../components/ImportBtn";
import { useQuery, useMutation, QueryClient } from "react-query";
import { fetchTransactions, uploadFile, getTransactionsAll, deleteTransaction } from "../api/api";
import { LoadingTransactions } from "../components/TransactionList/LoadingTransactions";
import { LoadingTables } from "../components/TablesPanel/LoadingTables";

type DeleteTransactionParams = {
  tableName: string;
  transactionId: number;
}

export const HomePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const queryClient = new QueryClient();

  const { data: transactionsData, isLoading: isTransactionsLoading, isError: isTransactionsError } = useQuery(
    ["transactions", selectedTable],
    () => fetchTransactions(selectedTable!),
    {
      enabled: !!selectedTable,
    }
  );

  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError } = useQuery("tables", getTransactionsAll, {
    onSuccess: (data) => {
      console.log("Tables:", data);
      if (data.length > 0 && selectedTable === null) {
        setSelectedTable(data[0]);
      }
    },
    initialData: [],
  });

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: () => {
      alert("File uploaded and data processed successfully!");
      queryClient.invalidateQueries("transactions");
      queryClient.invalidateQueries("tables");
    },
    onError: (error: Error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    },
  });

  const handleFileChange = (selectedFile: File) => {
    uploadFileMutation.mutate(selectedFile);
  };

  const deleteTransactionMutation = useMutation(
    ({ tableName, transactionId }: DeleteTransactionParams) => deleteTransaction(tableName, transactionId),
    {
      onSuccess: () => {
        alert("Transaction successfully deleted!");
        queryClient.invalidateQueries("transactions");
      },
      onError: (error: Error) => {
        console.error("Error deleting transaction:", error);
        alert("Error deleting transaction.");
      },
    }
  );

  const handleDeleteTransaction = (transactionId: number) => {
    if (selectedTable && window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate({ tableName: selectedTable, transactionId });
    }
  };

  useEffect(() => {
    if (tablesData.length > 0 && selectedTable === null) {
      setSelectedTable(tablesData[0]);
    }
  }, [tablesData, selectedTable]);

  return (
    <Container maxW="1440px" m="0 auto">
      <Box p={30} sx={{ display: "flex", border: "1px solid" }}>

        <LoadingTables
          isTablesLoading={isTablesLoading}
          isTablesError={isTablesError}
          tablesData={tablesData}
          setSelectedTable={setSelectedTable}
        />
        <Box sx={{ p: 10, border: "1px solid", w: "100%" }}>
          <Box m={10} >
            <ImportBtn onFileChange={handleFileChange} />
          </Box>
          <LoadingTransactions
            isTransactionsLoading={isTransactionsLoading}
            isTransactionsError={isTransactionsError}
            selectedTable={selectedTable}
            transactionsData={transactionsData}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </Box>
      </Box>
    </Container>
  );
};

