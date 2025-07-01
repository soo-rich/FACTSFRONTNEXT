import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { buttonDialogProps } from '@/types/types';

const OpenDialogonClick = ({ buttonprops, dialogprops }: buttonDialogProps) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          buttonprops?.buttonIcon && !buttonprops?.buttonLabel ? (
            <buttonprops.buttonIcon />
          ) : buttonprops?.buttonLabel ? (
            <Button variant="outline" size="sm">
              {buttonprops?.buttonIcon && <buttonprops.buttonIcon />}
              <span className="hidden lg:inline">{buttonprops.buttonLabel}</span>
            </Button>
          ) : null
        }

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogprops?.title ?? 'Ajouter'}</DialogTitle>
          {dialogprops?.description && (<DialogDescription>
            {dialogprops?.description ?? ''}
          </DialogDescription>)}
        </DialogHeader>
        {dialogprops?.children}
      </DialogContent>
    </Dialog>
  );
};

export default OpenDialogonClick;