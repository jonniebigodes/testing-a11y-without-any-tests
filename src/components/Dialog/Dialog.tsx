import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { createPortal } from 'react-dom'

export type DialogSize = 'small' | 'medium' | 'large' | 'fullscreen'

export interface DialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean
  /**
   * Title of the dialog
   */
  title?: React.ReactNode
  /**
   * Content of the dialog
   */
  children: React.ReactNode
  /**
   * Actions to display at the bottom of the dialog
   */
  actions?: React.ReactNode
  /**
   * Size of the dialog
   */
  size?: DialogSize
  /**
   * Whether to show a close button in the header
   */
  showCloseButton?: boolean
  /**
   * Whether to close the dialog when clicking outside
   */
  closeOnOutsideClick?: boolean
  /**
   * Whether to close the dialog when pressing escape
   */
  closeOnEscape?: boolean
  /**
   * Function to call when the dialog should close
   */
  onClose: () => void
  /**
   * Additional class name for the dialog
   */
  className?: string
  /**
   * Additional style for the dialog
   */
  style?: React.CSSProperties
  /**
   * Whether to show a backdrop behind the dialog
   */
  showBackdrop?: boolean
  /**
   * Whether the dialog is fullWidth (takes up the full width of its container)
   */
  fullWidth?: boolean
  /**
   * Maximum width of the dialog
   */
  maxWidth?: string | number
  /**
   * Whether to disable scrolling of the body when the dialog is open
   */
  disableBodyScroll?: boolean
  /**
   * Whether to render the dialog at the end of the document body
   */
  usePortal?: boolean
  /**
   * Data test id for testing
   */
  'data-testid'?: string
}

const getSizeStyles = (size: DialogSize, fullWidth?: boolean) => {
  switch (size) {
    case 'small':
      return {
        width: fullWidth ? '100%' : '400px',
        maxWidth: '90vw',
      }
    case 'large':
      return {
        width: fullWidth ? '100%' : '800px',
        maxWidth: '90vw',
      }
    case 'fullscreen':
      return {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: 0,
        borderRadius: 0,
      }
    default: // medium
      return {
        width: fullWidth ? '100%' : '600px',
        maxWidth: '90vw',
      }
  }
}

const DialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const DialogContainer = styled.div<{
  $size: DialogSize
  $fullWidth?: boolean
  $maxWidth?: string | number
}>`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  ${({ $size, $fullWidth }) => {
    const sizeStyles = getSizeStyles($size, $fullWidth)
    return Object.entries(sizeStyles)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')
  }}
  ${({ $maxWidth }) =>
    $maxWidth && `max-width: ${typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth};`}
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
`

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #212121;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #757575;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #212121;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.4);
    border-radius: 4px;
  }
`

const DialogContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`

const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
`

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  children,
  actions,
  size = 'medium',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  onClose,
  className,
  style,
  showBackdrop = true,
  fullWidth = false,
  maxWidth,
  disableBodyScroll = true,
  usePortal = true,
  'data-testid': dataTestId,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disableBodyScroll && open) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      if (disableBodyScroll) {
        document.body.style.overflow = ''
      }
    }
  }, [open, disableBodyScroll])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOnEscape, onClose, open])

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!open) {
    return null
  }

  const dialogContent = (
    <DialogBackdrop
      onClick={handleBackdropClick}
      style={{ display: showBackdrop ? 'flex' : 'none' }}
    >
      <DialogContainer
        ref={dialogRef}
        className={className}
        style={style}
        $size={size}
        $fullWidth={fullWidth}
        $maxWidth={maxWidth}
        data-testid={dataTestId}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="Close">
                ✕
              </CloseButton>
            )}
          </DialogHeader>
        )}
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </DialogContainer>
    </DialogBackdrop>
  )

  return usePortal ? createPortal(dialogContent, document.body) : dialogContent
}

export default Dialog
