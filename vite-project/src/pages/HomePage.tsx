// HomePage.tsx (компонент)
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ImportBtn } from '../components/ImportBtn';
import { TableTransactions } from '../components/TableTransactions';
import { useQuery, useMutation, QueryClient } from 'react-query';
import { fetchTransactions, uploadFile } from '../api/api';

export const HomePage = () => {
  const [_file, setFile] = useState<File | null>(null);
  const queryClient = new QueryClient();

  const { data, isLoading, isError } = useQuery('transactions', fetchTransactions, {
    onSuccess: () => {
    },
  });

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: () => {
      alert('File uploaded and data processed successfully!');
      setFile(null);
      queryClient.invalidateQueries('transactions');
    },
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    },
  });

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    uploadFileMutation.mutate(selectedFile);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  return (
    <Box p={4}>
      <ImportBtn onFileChange={handleFileChange} />
      <TableTransactions data={data} />
    </Box>
  );
};
