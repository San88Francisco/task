import { FC } from "react";
import { Box } from "@chakra-ui/react";

type TablesPanelProps = {
  setSelectedTable: (table: string) => void;
  tablesData: string[];
};

export const TablesPanel: FC<TablesPanelProps> = ({ setSelectedTable, tablesData }) => {
  const handleNameTable = (table: string) => {
    setSelectedTable(table);
  };

  return (
    <Box mt={4}>
      <Box as="h3" mb={2}>Table Names</Box>
      <Box width="400px" maxH="120px" overflowY="auto" border="1px solid #ccc" p={2}>
        {tablesData.map((table: string, index: number) => (
          <Box
            key={index}
            onClick={() => handleNameTable(table)}
            sx={{ cursor: "pointer", border: "1px solid #ccc", mb: 2, p: 10 }}
          >
            {table}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
