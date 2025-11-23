import type { FC, ReactNode } from 'react';

import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  loading: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

const LoadingButton: FC<LoadingButtonProps> = ({
                                                 loading,
                                                 loadingLabel = 'Chargement...',
                                                 children,
                                                 ...props
                                               }) => {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <CircularProgress
            color="inherit"
            size={20}
            sx={{ marginRight: 1 }}
          />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
