import { useMutation, useQueryClient } from 'react-query';
import { deleteTransaction } from '../../api/api';

const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteTransactionMutation } = useMutation(
    ({ tableName, transactionId }: { tableName: string, transactionId: number }) =>
      deleteTransaction(tableName, transactionId),
    {
      onSuccess: (_, { tableName }) => {
        queryClient.invalidateQueries(['transactions', tableName]);
      },
      onError: (error: Error) => {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction.');
      },
    }
  );

  return { deleteTransactionMutation };
};

export default useDeleteTransactionMutation;
