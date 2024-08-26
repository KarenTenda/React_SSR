import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, DotsVerticalIcon } from '../../../../../../../../../../public/assets/Icons';

interface CardHeaderComponentProps {
    title: string;
    onEditClick: () => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const CardHeaderComponent: React.FC<CardHeaderComponentProps> = ({ title, onEditClick, isEditing, setIsEditing }) => (
  <CardHeader className="flex flex-row justify-between items-center px-3 py-2">
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <input
          value={title}
          onBlur={() => setIsEditing(false)}
          className="text-sm border-b border-gray-300 focus:outline-none"
          autoFocus
        />
      ) : (
        <CardTitle className="flex flex-row text-sm">
          {title}
          <PencilIcon
            className="w-4 h-4 ml-2 cursor-pointer text-gray-400"
            onClick={onEditClick}
          />
        </CardTitle>
      )}
    </div>
    <Button variant="ghost" size="sm" className="text-sm p-1">
      <DotsVerticalIcon className="w-5 h-5 text-gray-400" />
    </Button>
  </CardHeader>
);

export default CardHeaderComponent;
