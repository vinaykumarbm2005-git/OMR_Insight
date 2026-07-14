import React from 'react';
import { Modal } from './Modal';
import { Button } from '../ui/Button';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
      <Button variant={isDestructive ? 'danger' : 'primary'} onClick={() => {
        onConfirm();
        onClose();
      }}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
};

export { ConfirmDialog };
