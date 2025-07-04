import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { buttonDialogProps } from '@/types/types';
import { useState } from 'react';

type OpenDialogonClickProps = buttonDialogProps & {
  open?: boolean,
  setOpen?: (open: boolean) => void
}

const OpenDialogonClick = ({ buttonprops, dialogprops, open, setOpen }: OpenDialogonClickProps) => {

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && setOpen !== undefined
  return (
    <Dialog open={isControlled ? open : internalOpen} onOpenChange={isControlled ? setOpen! : setInternalOpen}>
      <DialogTrigger asChild>
        {
          buttonprops?.buttonIcon && !buttonprops?.buttonLabel ? (
            <buttonprops.buttonIcon className={buttonprops.buttonIconClassName} />
          ) : buttonprops?.buttonLabel ? (
            <Button variant="outline" size="sm" className={buttonprops.buttonClassName}>
              {buttonprops?.buttonIcon && <buttonprops.buttonIcon className={buttonprops.buttonIconClassName} />}
              <span className="hidden lg:inline">{buttonprops.buttonLabel}</span>
            </Button>
          ) : null
        }

      </DialogTrigger>
      <DialogContent className={cn('', dialogprops?.dialogContentClassName?.className)}>
        <DialogHeader>
          <DialogTitle>{dialogprops?.title}</DialogTitle>
          {dialogprops?.description && (<DialogDescription>
            {dialogprops?.description ?? ''}
          </DialogDescription>)}
        </DialogHeader>
        {dialogprops?.children}
      </DialogContent>
    </Dialog>
  );
};





const OpenDialogControl = ({ dialogprops, open, setOpen }: Pick<OpenDialogonClickProps, 'open' | 'setOpen' | 'dialogprops'>) => {

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && setOpen !== undefined
  return (
    <Dialog open={isControlled ? open : internalOpen} onOpenChange={isControlled ? setOpen! : setInternalOpen}>
      <DialogContent className={cn('', dialogprops?.dialogContentClassName?.className)}>
        <DialogHeader>
          <DialogTitle>{dialogprops?.title}</DialogTitle>
          {dialogprops?.description && (<DialogDescription>
            {dialogprops?.description ?? ''}
          </DialogDescription>)}
        </DialogHeader>
        {dialogprops?.children}
      </DialogContent>
    </Dialog>
  );
};




export { OpenDialogControl, OpenDialogonClick };

