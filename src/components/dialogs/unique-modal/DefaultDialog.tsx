import {Dialog} from "@mui/material";
import {AddEditModalType} from "@/types/soosmart/add-edit-modal.type";
import DialogCloseButton from "@components/dialogs/DialogCloseButton";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";

const DefaultDialog = ({open, setOpen, title, subtitle, children, OnSuccess , dialogMaxWidth}: AddEditModalType) => {
  const handleClose = () => {
    setOpen(false)
  }

  const handleSuccess = () => {
    OnSuccess?.();
    handleClose()

  }
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth={dialogMaxWidth??'sm'}
      scroll='body'
      closeAfterTransition={false}
      sx={{'& .MuiDialog-paper': {overflow: 'visible'}}}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x'/>
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {title}
        <Typography component='span' className='flex flex-col text-center'>
          {subtitle}
        </Typography>
      </DialogTitle>
      <DialogContent className="sm:pbs-0 sm:pbe-6 sm:pli-16">
      {children}
      </DialogContent>
    </Dialog>
  );
}


export default DefaultDialog
