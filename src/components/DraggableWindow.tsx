import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, X, Move } from 'lucide-react';

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  onClose?: () => void;
  className?: string;
  headerColor?: string;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  title,
  children,
  initialPosition,
  initialSize,
  minSize = { width: 300, height: 200 },
  maxSize = { width: window.innerWidth, height: window.innerHeight },
  onClose,
  className = '',
  headerColor = 'bg-blue-600'
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(initialSize);
  const [previousPosition, setPreviousPosition] = useState(initialPosition);

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Limitar el arrastre dentro de la ventana del navegador
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }

      if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;

        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(minSize.width, Math.min(maxSize.width, e.clientX - rect.left));
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(minSize.height, Math.min(maxSize.height, e.clientY - rect.top));
        }
        if (resizeDirection.includes('left')) {
          const deltaX = e.clientX - rect.left;
          newWidth = Math.max(minSize.width, size.width - deltaX);
          newX = position.x + (size.width - newWidth);
        }
        if (resizeDirection.includes('top')) {
          const deltaY = e.clientY - rect.top;
          newHeight = Math.max(minSize.height, size.height - deltaY);
          newY = position.y + (size.height - newHeight);
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, size, position, resizeDirection, minSize, maxSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleMinimize = () => {
    if (!isMinimized) {
      setPreviousSize(size);
      setSize({ width: size.width, height: 40 });
    } else {
      setSize(previousSize);
    }
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize(previousSize);
      setPosition(previousPosition);
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden z-40 ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: minSize.width,
        minHeight: minSize.height
      }}
    >
      {/* Header */}
      <div
        className={`${headerColor} text-white px-4 py-2 flex items-center justify-between cursor-move drag-handle select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          <Move className="h-4 w-4 mr-2 opacity-70" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            title={isMinimized ? "Restaurar" : "Minimizar"}
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            <Maximize2 className="h-3 w-3" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500 rounded transition-colors"
              title="Cerrar"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden" style={{ height: size.height - 40 }}>
          {children}
        </div>
      )}

      {/* Resize handles */}
      {!isMinimized && !isMaximized && (
        <>
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={handleResizeStart('top-left')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={handleResizeStart('top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={handleResizeStart('bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={handleResizeStart('bottom-right')}
          />
          
          {/* Edges */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={handleResizeStart('top')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={handleResizeStart('bottom')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={handleResizeStart('left')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={handleResizeStart('right')}
          />
        </>
      )}
    </div>
  );
};

export default DraggableWindow;