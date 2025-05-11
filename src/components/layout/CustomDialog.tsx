import React, {ReactNode} from 'react';
import {Dialog as BaseDialog} from '@/components/ui/dialog';
import {DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter} from '@/components/ui/dialog';

interface CustomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    fullHeight?: boolean;
    showClose?: boolean;
    contentClassName?: string;
}

export const CustomDialog = ({
                                 open,
                                 onOpenChange,
                                 title,
                                 description,
                                 children,
                                 footer,
                                 className = '',
                                 maxWidth = 'lg',
                                 fullHeight = false,
                                 showClose = true,
                                 contentClassName = '',
                             }: CustomDialogProps) => {
    // 最大幅のマッピング
    const maxWidthClasses = {
        sm: 'max-w-sm !sm:max-w-sm',
        md: 'max-w-md !sm:max-w-md',
        lg: 'max-w-lg !sm:max-w-lg',
        xl: 'max-w-xl !sm:max-w-xl',
        '2xl': 'max-w-2xl !sm:max-w-2xl',
        '3xl': 'max-w-3xl !sm:max-w-3xl',
        '4xl': 'max-w-4xl !sm:max-w-4xl',
        '5xl': 'max-w-5xl !sm:max-w-5xl',
        full: 'max-w-[95vw] !sm:max-w-[95vw] w-[95vw]',
    };

    return (
        <BaseDialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`${maxWidthClasses[maxWidth]} ${fullHeight ? 'h-[80vh]' : ''} ${fullHeight ? 'overflow-y-auto' : ''} ${className} ${!showClose ? 'hide-close-button' : ''}`}
                style={{
                    maxWidth: maxWidth === 'full' ? '95vw' : undefined,
                    width: maxWidth === 'full' ? '95vw' : undefined
                }}
            >
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle>{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}

                <div className={contentClassName}>
                    {children}
                </div>

                {footer && (
                    <DialogFooter>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </BaseDialog>
    );
}; 