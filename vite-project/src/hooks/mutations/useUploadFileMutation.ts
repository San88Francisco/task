
import { useMutation, useQueryClient } from 'react-query';
import { uploadFile } from '../../api/api';
import { ALL_TABLES_KEY } from '../queryKeys/queryKeys';

const useUploadFileMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: uploadFileMutation } = useMutation(uploadFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_TABLES_KEY);
    },
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
    },
  });

  return { uploadFileMutation };
};

export { useUploadFileMutation };
