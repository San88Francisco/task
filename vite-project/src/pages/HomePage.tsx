import { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { ImportBtn } from "../components/ImportBtn";
import { TablesPanel } from "../components/TablesPanel";
import { useQuery } from "react-query";
import { getTableAll } from "../api/api";
import { LoadingTransactions, Transaction } from "../components/TransactionList";
import { DownloadCSV } from "../components/DownloadCSV";


export const HomePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  console.log('✌️selectedTable --->', selectedTable);
  const [downloadArray, setDownloadArray] = useState<Transaction[]>([])

  const { data: tablesData, isLoading } = useQuery({
    queryFn: () => getTableAll(),
    queryKey: ['all-tables'],
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <p>Loading tables...</p>;
  }


  return (
    <Container maxW="1440px" m="0 auto">
      <Box p={30} sx={{ display: "flex", gap: 20 }}>

        <TablesPanel
          tablesData={tablesData}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
        <Box sx={{ p: 10, w: "100%", }}>
          <Box m={10} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }} >
            <ImportBtn />
            <DownloadCSV downloadArray={downloadArray} />
          </Box>
          <LoadingTransactions
            selectedTable={selectedTable}
            setDownloadArray={setDownloadArray}
          />

        </Box>
      </Box>
    </Container>
  );
};
