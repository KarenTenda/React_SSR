
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface ClickableIconButtonProps {
  Icon: React.ElementType;
  onClick: () => void;
  tooltipText: string;
  disabled?: boolean;
}

const ClickableIconButton: React.FC<ClickableIconButtonProps> = ({ Icon, onClick, tooltipText, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-${tooltipText}`}>
          {tooltipText}
        </Tooltip>
      }
    >
      <div 
        onClick={handleClick} 
        className={`inline-block mx-1 text-2xl ${
            disabled ? 'text-gray-500 cursor-not-allowed' : 'text-[#FA8072] cursor-pointer'
          }`}
      >
        <Icon />
      </div>
    </OverlayTrigger>
  );
}

export default ClickableIconButton;
