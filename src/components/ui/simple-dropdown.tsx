"use client";

import * as React from 'react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Create context for dropdown state
const DropdownContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

type DropdownChildren = 
  | React.ReactNode
  | ((props: { isOpen: boolean; close: () => void }) => React.ReactNode);

interface SimpleDropdownProps {
  children: DropdownChildren;
}

// Simple dropdown component
export function SimpleDropdown({ children }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({ isOpen, close: () => setIsOpen(false) });
    }
    return children;
  };
  
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">
        {renderChildren()}
      </div>
    </DropdownContext.Provider>
  );
}

interface SimpleDropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function SimpleDropdownTrigger({ 
  children,
  asChild = false,
  className
}: SimpleDropdownTriggerProps) {
  const context = useContext(DropdownContext);
  
  if (!context) {
    throw new Error('DropdownTrigger must be used within a Dropdown');
  }
  
  const { isOpen, setIsOpen } = context;
  
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  if (asChild && React.isValidElement(children)) {
    const child = React.Children.only(children) as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      [key: string]: any;
    }>;
    
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick();
      },
      'aria-expanded': isOpen,
      'aria-haspopup': 'menu',
      className: cn(child.props.className, className)
    });
  }
  
  return (
    <button 
      type="button"
      onClick={handleClick}
      className={cn("focus:outline-none", className)}
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      {children}
    </button>
  );
}

interface SimpleDropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function SimpleDropdownContent({ 
  children, 
  className,
  align = 'start',
  sideOffset = 8,
  ...props
}: SimpleDropdownContentProps) {
  const context = useContext(DropdownContext);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  if (!context) {
    throw new Error('DropdownContent must be used within a Dropdown');
  }
  
  const { isOpen, setIsOpen } = context;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;
  
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div 
      ref={dropdownRef}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        alignClasses[align],
        `mt-${sideOffset}`,
        className
      )}
      style={{
        position: 'absolute',
        top: '100%',
        marginTop: sideOffset,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

interface SimpleDropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function SimpleDropdownItem({ 
  children, 
  className,
  onClick,
  ...props
}: SimpleDropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface SimpleDropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SimpleDropdownLabel({ 
  children,
  className 
}: SimpleDropdownLabelProps) {
  return (
    <div className={cn("px-4 py-2 text-sm font-semibold text-gray-700", className)}>
      {children}
    </div>
  );
}

interface SimpleDropdownSeparatorProps {
  className?: string;
}

export function SimpleDropdownSeparator({ className }: SimpleDropdownSeparatorProps) {
  return <div className={cn("border-t border-gray-100 my-1", className)} />;
}

interface SimpleDropdownGroupProps {
  children: React.ReactNode;
  className?: string;
}

// Group component for organizing dropdown items
export function SimpleDropdownGroup({ children, className }: SimpleDropdownGroupProps) {
  return <div className={className}>{children}</div>;
}
