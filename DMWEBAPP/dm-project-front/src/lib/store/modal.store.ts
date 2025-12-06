import { create } from "zustand";

export type ModalTypes = null;

interface ModalState {
  modal: ModalTypes;
  modalData?: any;
  id?: string | number;
  isPending?: boolean;
  onDelete?: () => Promise<void>;
  openModal: (args: {
    type: ModalTypes;
    modalData?: any;
    id?: string | number;
    onDelete?: () => Promise<void>;
  }) => void;
  setIsPending: (isPending: boolean) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  modalData: null,
  id: 0,
  isPending: false,

  //i want to hold a function in the store
  onDelete: async () => {
    set({ isPending: true });
  },
  openModal: ({ type, modalData, id, onDelete }) =>
    set({ modal: type, modalData, id, onDelete, isPending: false }),

  setIsPending: (isPending: boolean) => set({ isPending }),
  closeModal: () =>
    set({
      id: 0,
      modal: null,
      modalData: null,
    }),
}));
