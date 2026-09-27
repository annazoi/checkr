import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error";

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

export type ModalState = {
  id: string;
  content: React.ReactNode;
} | null;

type UIState = {
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;

  modal: ModalState;
  openModal: (id: string, content: React.ReactNode) => void;
  closeModal: () => void;

  mobileSearchOpen: boolean;
  setMobileSearchOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  showToast: (message, variant = "default") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), message, variant },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  modal: null,
  openModal: (id, content) => set({ modal: { id, content } }),
  closeModal: () => set({ modal: null }),

  mobileSearchOpen: false,
  setMobileSearchOpen: (open) => set({ mobileSearchOpen: open }),
}));
