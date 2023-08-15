import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLoading?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ConfirmDialog = ({ title, message, onConfirm, confirmLoading, open, setOpen }: ConfirmDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={async () => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={confirmLoading}
          onClick={async () => {
            await onConfirm();
            setOpen(false);
          }}
        >
          Ok
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
