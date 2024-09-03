import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Button } from '@/components/ui/button';

interface ClickableIconButtonProps {
  Icon: React.ElementType;
  onClick?: () => void;
  tooltipText: string;
  disabled?: boolean;
}

const ClickableIconButton = React.forwardRef<HTMLButtonElement, ClickableIconButtonProps>(
  ({ Icon, onClick, tooltipText, disabled }, ref) => {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={`tooltip-${tooltipText}`}>
            {tooltipText}
          </Tooltip>
        }
      >
        <Button 
          ref={ref}
          onClick={onClick} 
          className={`inline-block px-2 ${
              disabled ? 'text-gray-500 cursor-not-allowed' : 'text-[#FA8072] cursor-pointer'
            }`}
          disabled={disabled}
          variant='ghost'
          size='sm'
        >
          <Icon />
        </Button>
      </OverlayTrigger>
    );
  }
);

ClickableIconButton.displayName = 'ClickableIconButton'; // For better debugging and development tools support

export default ClickableIconButton;
