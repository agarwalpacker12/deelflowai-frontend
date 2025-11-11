// DialogBox.tsx
import React from "react";
import { Dialog, Flex, Button } from "@radix-ui/themes";

interface DialogBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  showActions?: boolean;
}

function DialogBox({ 
  open, 
  setOpen, 
  title, 
  description, 
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  showActions = true
}: DialogBoxProps) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="450px">
        {title && <Dialog.Title>{title}</Dialog.Title>}
        {description && (
          <Dialog.Description size="2" mb="4">
            {description}
          </Dialog.Description>
        )}

        {/* Dynamic Content Here */}
        <Flex direction="column" gap="3">
          {children}
        </Flex>

        {/* Action buttons */}
        {showActions && (
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={handleCancel}>
                {cancelText}
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleSave}>
                {saveText}
              </Button>
            </Dialog.Close>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default DialogBox;
