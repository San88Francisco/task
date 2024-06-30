import { useQuery } from 'react-query';
import { fetchTransactions } from '../../api/api';
import { Transaction } from '../../components/TransactionList';

const useTransactionsQuery = (selectedTable: string | null, setDownloadArray: (data: Transaction[]) => void) => {
  const { data: transactions } = useQuery(['transactions', selectedTable], () => fetchTransactions(selectedTable!), {
    enabled: !!selectedTable,
    onSuccess: (data) => {
      if (data) {
        setDownloadArray(data);
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return { transactions };
};

export { useTransactionsQuery };
