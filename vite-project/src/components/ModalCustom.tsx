import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "./TransactionList";
import { updateTransactionClient } from "../api/api";

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
  setSelectedTransactionId,
  transactions,
}) => {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

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

  const mutation = useMutation(
    (data: any) => updateTransactionClient(selectedTable, selectedTransactionId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions', selectedTable]);
        setSelectedTransactionId(null);
      },
      onError: (error: Error) => {
        console.error('Error updating transaction:', error);
        alert('Error updating transaction.');
      },
    }
  );

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setUpdating(false);
      setOpenModal(false);
    }
  };

  return (
    <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
      <ModalOverlay />
      <ModalContent sx={{ h: '100vh', p: 30, fontFamily: 'Roboto', bg: '#fff' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalBody>
            <FormControl>
              {selectedTransactionId !== null && (
                <>
                  <FormLabel>ID:</FormLabel>
                  <Input value={selectedTransactionId} isReadOnly sx={{ width: '100%' }} />

                  <FormLabel>Status:</FormLabel>
                  <Select placeholder='Select status' {...register("status")} sx={{ width: '100%' }} color="white">
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  <p style={{ color: 'red' }}>{errors.status?.message}</p>

                  <FormLabel>Type:</FormLabel>
                  <Select placeholder='Select type' {...register("type")} sx={{ width: '100%' }} color="white">
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  <p style={{ color: 'red' }}>{errors.type?.message}</p>

                  <FormLabel>Client Name:</FormLabel>
                  <Input {...register("clientName")} sx={{ width: '100%' }} />
                  <p style={{ color: 'red' }}>{errors.clientName?.message}</p>

                  <FormLabel>Amount:</FormLabel>
                  <Input type="text" {...register("amount")} sx={{ width: '100%' }} />
                  <p style={{ color: 'red' }}>{errors.amount?.message}</p>
                </>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" isLoading={updating}>
              Save changes
            </Button>
            <Button variant="ghost" onClick={() => setOpenModal(false)} disabled={updating}>
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
