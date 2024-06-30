import { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { ImportCSVBtn } from '../components/ImportCSVBtn';
import { TablesPanel } from '../components/TablesPanel';
import { LoadingTransactions, Transaction } from '../components/TransactionList';
import { DownloadCSVBtn } from '../components/DownloadCSVBtn';
import { useTablesQuery } from '../hooks/queries/useTablesQuery';

export const HomePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [downloadArray, setDownloadArray] = useState<Transaction[]>([]);

  const { tablesData, isLoading } = useTablesQuery();

  if (isLoading) {
    return <p>Loading tables...</p>;
  }

  return (
    <Container maxW="1440px" m="0 auto">
      <Box p={30} sx={{ display: 'flex', gap: 20 }}>
        <TablesPanel
          tablesData={tablesData}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
        <Box sx={{ p: 10, w: '100%' }}>
          <Box m={10} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
            <ImportCSVBtn />
            <DownloadCSVBtn downloadArray={downloadArray} />
          </Box>
          <LoadingTransactions selectedTable={selectedTable} setDownloadArray={setDownloadArray} />
        </Box>
      </Box>
    </Container>
  );
};
