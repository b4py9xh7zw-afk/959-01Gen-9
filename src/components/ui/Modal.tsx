import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ModalProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export default function Modal({
  title,
  children,
  className,
  onClose,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
}: ModalProps) {
  const { isModalOpen, closeModal } = useAppStore();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  useEffect(() => {
    if (!closeOnEsc || !isModalOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, closeOnEsc]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => closeOnBackdrop && handleClose()}
      />
      <div className={cn(
        'relative bg-surface border border-border rounded-2xl shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-in',
        className
      )}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 border-b border-border">
            {title && (
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-surface-light text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
