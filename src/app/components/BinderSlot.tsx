import { useDrop } from 'react-dnd';
import { Card } from '../types';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface BinderSlotProps {
  row: number;
  col: number;
  card: Card | null | undefined;
  onDrop: (cardId: string, row: number, col: number) => void;
  onRemove: () => void;
}

export function BinderSlot({ row, col, card, onDrop, onRemove }: BinderSlotProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { cardId: string }) => {
      onDrop(item.cardId, row, col);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`
        aspect-[2.5/3.5] rounded-lg border-2 transition-all relative group
        ${card ? 'border-gray-300 dark:border-gray-600' : 'border-dashed border-gray-300 dark:border-gray-700'}
        ${isOver && canDrop ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${!card && !isOver ? 'bg-gray-50 dark:bg-gray-800' : ''}
      `}
    >
      {card ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center p-2">
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
                {card.name}
              </p>
              {card.is_graded && (
                <Badge variant="secondary" className="mt-1 text-[8px] sm:text-[10px] px-1 py-0">
                  {card.grading?.company} {card.grading?.grade}
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={onRemove}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {isOver ? 'Drop here' : 'Empty'}
          </p>
        </div>
      )}
    </div>
  );
}
