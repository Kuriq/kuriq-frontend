import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, children, maxWidth = "720px" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-[24px] shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalCloseButtonProps {
  onClose: () => void;
}

export function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="text-[#777777] hover:text-[#2C2C2C] transition-colors"
      aria-label="Close modal"
    >
      <X className="w-6 h-6" />
    </button>
  );
}
