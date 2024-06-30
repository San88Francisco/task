
import { useMutation, useQueryClient } from 'react-query';
import { updateTransactionClient } from '../../api/api';
import { Transaction } from '../../components/TransactionList';

const useEditTransactionFieldMutation = (selectedTable: string | null, selectedTransactionId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: Transaction) => updateTransactionClient(selectedTable!, selectedTransactionId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions', selectedTable]);
      },
      onError: (error: Error) => {
        console.error('Error updating transaction:', error);
      },
    }
  );
};

export { useEditTransactionFieldMutation };
