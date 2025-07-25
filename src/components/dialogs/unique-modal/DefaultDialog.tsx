import {Dialog} from "@mui/material";
import {AddEditModalType} from "@/types/soosmart/add-edit-modal.type";
import DialogCloseButton from "@components/dialogs/DialogCloseButton";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

const DefaultDialog = ({open, setOpen, title, subtitle, children}: AddEditModalType) => {
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
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

      {children}
    </Dialog>
  );
}


export default DefaultDialog
