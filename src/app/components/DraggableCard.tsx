import { useDrag } from 'react-dnd';
import { Card } from '../types';
import { Badge } from './ui/badge';
import { GripVertical, CheckCircle2 } from 'lucide-react';

interface DraggableCardProps {
  card: Card;
  isUsed: boolean;
}

export function DraggableCard({ card, isUsed }: DraggableCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { cardId: card._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
        cursor-move hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
        ${isUsed ? 'opacity-60' : ''}
      `}
    >
      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
          {card.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {card.set} • {card.card_number}
        </p>
        {card.is_graded && (
          <Badge variant="secondary" className="mt-1 text-xs">
            {card.grading?.company} {card.grading?.grade}
          </Badge>
        )}
      </div>
      {isUsed && (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      )}
    </div>
  );
}
