export const ALL_TABLES_KEY = 'all-tables';

export const TRANSACTIONS_KEY = (selectedTable: string | null) =>
  selectedTable ? ['transactions', selectedTable] : [];