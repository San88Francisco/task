import { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

type TablesPanelProps = {
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  tablesData: string[];
};

const boxStyles = {
  w: 475,
  borderRadius: 20,
  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
  fontFamily: 'Roboto',
  borderTop: '20px solid #c1e2a4',
  m: 10,
};

export const TablesPanel: FC<TablesPanelProps> = ({
  setSelectedTable,
  selectedTable,
  tablesData,
}) => {
  const [activeTable, setActiveTable] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTable && tablesData.length > 0) {
      setSelectedTable(tablesData[0]);
    }
  }, [tablesData, selectedTable, setSelectedTable]);

  const handleNameTable = (table: string) => {
    setSelectedTable(table);
    setActiveTable(table);
  };

  return (
    <Box mt={4}>
      <Box as="h3" mb={2}>
        Table Names
      </Box>
      <Box sx={boxStyles}>
        <Box sx={{ overflowY: 'auto', height: '270px' }}>
          {tablesData.map((table: string, index: number) => (
            <Box
              key={index}
              onClick={() => handleNameTable(table)}
              sx={{
                cursor: 'pointer',
                borderBottom: '1px solid #ccc',
                padding: 10,
                backgroundColor: activeTable === table ? '#eef7e6' : 'transparent',
              }}
            >
              {index + 1 + ') '} {table}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
