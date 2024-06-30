import { FC, useRef } from 'react';
import { Input } from '@chakra-ui/react';
import { useUploadFileMutation } from '../hooks/mutations/useUploadFileMutation';
import { StyledButton } from '../styles/style';

export const ImportCSVBtn: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileMutation } = useUploadFileMutation();

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
      <StyledButton onClick={handleButtonClick}>Import</StyledButton>
      <Input type="file" onChange={handleFileChange} ref={fileInputRef} display="none" />
    </>
  );
};
