"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";

interface Item { id: string; [key: string]: unknown; }

interface Props<T extends Item> {
  items: T[];
  onReorder: (newIds: string[]) => void;
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
}

export default function DraggableList<T extends Item>({ items, onReorder, renderItem }: Props<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragItem = useRef<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    dragItem.current = id;
    setDraggingId(id);
  }, []);

  const handleDragEnter = useCallback((id: string) => {
    if (dragItem.current !== id) setOverId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current && overId && dragItem.current !== overId) {
      const currentIds = items.map((i) => i.id);
      const fromIdx = currentIds.indexOf(dragItem.current);
      const toIdx = currentIds.indexOf(overId);
      const newIds = [...currentIds];
      const [moved] = newIds.splice(fromIdx, 1);
      newIds.splice(toIdx, 0, moved);
      onReorder(newIds);
    }
    dragItem.current = null;
    setDraggingId(null);
    setOverId(null);
  }, [items, overId, onReorder]);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isDragging = draggingId === item.id;
        const isOver = overId === item.id;

        return (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            onDragEnter={() => handleDragEnter(item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-start gap-2 transition-all duration-150 ${
              isDragging ? "opacity-40 scale-[0.99]" : "opacity-100"
            } ${isOver ? "translate-y-0.5" : ""}`}
          >
            {/* Drag handle */}
            <div className="mt-4 p-1.5 rounded cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 min-w-0">
              {renderItem(item, isDragging)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
