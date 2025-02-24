
// Alert
type AlertState = {
  isOpen?: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "information";
};

// Confirm
type ConfirmState = {
  isOpen?: boolean;
  title: string;
  message: string;
  feature: string;
  onConfirm?: () => void;
};

// Modal
type ModalState = {
  isOpen?: boolean;
  title: string;
  content: React.ReactNode;
  screen?: string;
};

// Image detail
type ImageDetailState = {
  isOpen?: boolean;
  title: string;
  image: string;
  screen?: string;
};

