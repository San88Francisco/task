import { ChangeEvent, FC, useRef } from 'react';
import { Button, Input } from '@chakra-ui/react';

type PropsType = {
  onFileChange: (file: File) => void;
}

export const ImportBtn: FC<PropsType> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button onClick={handleButtonClick}>Import</Button>
      <Input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        display="none"
      />
    </>
  );
};

