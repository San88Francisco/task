import { useState, useEffect } from 'react';
import { Transaction } from '../components/TransactionList';
import { useTransactionsQuery } from '../hooks/queries/useTransactionsQuery';

const useSortedTransactions = (
  selectedTable: string | null,
  setDownloadArray: (data: Transaction[]) => void
) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [sortCycleIndex, setSortCycleIndex] = useState<number | null>(null);
  const [order, setOrder] = useState<'ASC' | 'DSC'>('ASC');
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  const { transactions } = useTransactionsQuery(selectedTable, setDownloadArray);

  useEffect(() => {
    setPageNumber(0);
    setOrder('ASC');
    setSortColumn('TransactionId');
  }, [transactions]);

  useEffect(() => {
    setSortCycleIndex(null);
  }, [selectedTable]);

  useEffect(() => {
    setDownloadArray(sortedTransactions());
  }, [sortColumn, order]);

  const handleSortClick = (type: string) => {
    setSortColumn(type);
    if (type === 'Status') {
      setSortCycleIndex(prevSortCycleIndex => (prevSortCycleIndex === null ? 0 : (prevSortCycleIndex + 1) % 3));
    } else {
      setOrder(prevOrder => (prevOrder === 'ASC' ? 'DSC' : 'ASC'));
    }
  };

  const sortedTransactions = () => {
    if (!transactions) return [];

    let sortedData = [...transactions];

    if (sortColumn === 'Status') {
      const statusOrder = ['Pending', 'Completed', 'Cancelled'];

      sortedData.sort((a, b) => {
        if (sortCycleIndex === null) return 0;

        const aStatusIndex = statusOrder.indexOf(a.Status);
        const bStatusIndex = statusOrder.indexOf(b.Status);

        if (a.Status === statusOrder[sortCycleIndex]) return -1;
        if (b.Status === statusOrder[sortCycleIndex]) return 1;

        return aStatusIndex - bStatusIndex;
      });
    } else if (sortColumn === 'TransactionId' || sortColumn === 'Amount') {
      sortedData.sort((a, b) => {
        const fieldA = a[sortColumn];
        const fieldB = b[sortColumn];

        return order === 'ASC' ? fieldA - fieldB : fieldB - fieldA;
      });
    } else if (sortColumn === 'Type' || sortColumn === 'ClientName') {
      sortedData.sort((a, b) => {
        const fieldA = a[sortColumn];
        const fieldB = b[sortColumn];

        return order === 'ASC' ? fieldB.localeCompare(fieldA) : fieldA.localeCompare(fieldB);
      });
    }

    return sortedData;
  };

  const displayData = sortedTransactions().slice(pageNumber * 10, (pageNumber + 1) * 10);
  const transactionsPerPage = 10;
  const pageCount = transactions ? Math.ceil(transactions.length / transactionsPerPage) : 1;

  return {
    displayData,
    pageNumber,
    pageCount,
    handleSortClick,
    setPageNumber,
    transactions
  };
};

export { useSortedTransactions };
