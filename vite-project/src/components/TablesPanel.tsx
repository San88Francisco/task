import { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { BoxContainer } from '../styles/style';

type TablesPanelProps = {
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  tablesData: string[];
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
    <Box mt={85}>
      <BoxContainer>
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
              {`${index + 1}) ${table}`}
            </Box>
          ))}
        </Box>
      </BoxContainer>
    </Box>
  );
};
