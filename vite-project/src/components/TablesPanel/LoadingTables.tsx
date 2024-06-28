import { FC } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { TablesPanel } from './TablesPanel';

type LoadingTablesProps = {
  isTablesLoading: boolean;
  isTablesError: boolean;
  tablesData: string[];
  setSelectedTable: (table: string | null) => void;
};

export const LoadingTables: FC<LoadingTablesProps> = ({
  isTablesLoading,
  isTablesError,
  tablesData,
  setSelectedTable,
}) => {
  if (isTablesLoading) {
    return <p>Loading tables...</p>;
  }

  if (isTablesError) {
    return (
      <Alert status="error" mt={4} variant="left-accent">
        <AlertIcon />
        <AlertTitle>Error fetching tables</AlertTitle>
      </Alert>
    );
  }

  return <TablesPanel setSelectedTable={setSelectedTable} tablesData={tablesData} />;
};

