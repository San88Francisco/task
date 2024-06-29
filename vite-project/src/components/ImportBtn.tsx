import { FC, useRef } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { uploadFile } from '../api/api';
import { buttonStyles } from './DownloadCSV';


export const ImportBtn: FC = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const client = useQueryClient()

  const { mutate: uploadFileMutation } = useMutation(uploadFile, {
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['all-tables'] })
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        uploadFileMutation(selectedFile);
      } else {
        alert('Please select a CSV file.');
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button sx={buttonStyles} onClick={handleButtonClick}>Import</Button>
      <Input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        display="none"
      />
    </>
  );
};
