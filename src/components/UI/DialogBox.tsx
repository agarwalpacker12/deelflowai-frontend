// DialogBox.jsx
import { Dialog, Flex } from "@radix-ui/themes";

function DialogBox({ open, setOpen, title, description, children }) {
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
        {/* <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex> */}
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default DialogBox;
