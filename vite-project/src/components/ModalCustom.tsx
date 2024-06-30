import { FC, useEffect, Dispatch, SetStateAction } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Transaction } from "./TransactionList";
import { useEditTransactionFieldMutation } from "../hooks/mutations/useEditTransactionFieldMutation";
import { StyledButton } from "../styles/style";

type PropsType = {
  openModal: boolean;
  selectedTable: string;
  selectedTransactionId: number | null;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setSelectedTransactionId: Dispatch<SetStateAction<number | null>>;
  transactions: Transaction[];
};

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const typeOptions = [
  { value: 'Refill', label: 'Refill' },
  { value: 'Withdrawal', label: 'Withdrawal' },
];

const schema = yup.object().shape({
  status: yup.string().required("Status is required"),
  type: yup.string().required("Type is required"),
  clientName: yup.string().required("Client Name is required"),
  amount: yup.number().required("Amount is required").typeError("Amount must be a number"),
});

export const ModalCustom: FC<PropsType> = ({
  openModal,
  setOpenModal,
  selectedTable,
  selectedTransactionId,
  transactions,
}) => {


  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (openModal && selectedTransactionId !== null) {
      const selectedTransaction = transactions.find(t => t.TransactionId === selectedTransactionId);
      if (selectedTransaction) {
        setValue("status", selectedTransaction.Status);
        setValue("type", selectedTransaction.Type);
        setValue("clientName", selectedTransaction.ClientName);
        setValue("amount", selectedTransaction.Amount);
      }
    } else {
      reset();
    }
  }, [openModal, selectedTransactionId, transactions, setValue, reset]);

  const mutation = useEditTransactionFieldMutation(selectedTable, selectedTransactionId);

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
      <ModalOverlay />
      <ModalContent sx={{ h: '100vh', p: 30, fontFamily: 'Roboto', bg: '#fff', }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody sx={{ display: 'flex', justifyContent: 'center' }} >
            <FormControl width={'300px'} >
              {selectedTransactionId !== null && (
                <>
                  <FormLabel>ID:</FormLabel>
                  <Input value={selectedTransactionId} isReadOnly sx={{ width: 275, p: '5px 10px', mb: 15 }} />

                  <FormLabel>Status:</FormLabel>
                  <Select placeholder='Select status' {...register("status")} sx={{ width: '100%', p: '8px 10px' }} color="white">
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  <p style={{ color: 'red' }}>{errors.status?.message}</p>

                  <FormLabel>Type:</FormLabel>
                  <Select placeholder='Select type' {...register("type")} sx={{ width: '100%', p: '5px 10px' }} color="white">
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  <p style={{ color: 'red' }}>{errors.type?.message}</p>

                  <FormLabel>Client Name:</FormLabel>
                  <Input {...register("clientName")} sx={{ width: 275, p: '5px 10px' }} />
                  <p style={{ color: 'red' }}>{errors.clientName?.message}</p>

                  <FormLabel>Amount:</FormLabel>
                  <Input type="text" {...register("amount")} sx={{ width: 275, p: '5px 10px' }} />
                  <p style={{ color: 'red' }}>{errors.amount?.message}</p>
                  <StyledButton type="submit">
                    Save changes
                  </StyledButton>
                  <StyledButton onClick={() => setOpenModal(false)} >
                    Close
                  </StyledButton>
                </>
              )}
            </FormControl>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
};
