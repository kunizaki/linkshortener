import React, {useState, useEffect, useCallback} from 'react'

interface SnackbarNotifyProps {
  message: string
  severity: 'error' | 'info' | 'success' | 'warning'
  setNotifyMessage: (value: { message: string; severity: 'error' | 'info' | 'success' | 'warning' }) => void
}

const TIMEOUT = 10000 // 10 segundos

export function SnackbarNotify({ message, severity, setNotifyMessage }: SnackbarNotifyProps) {
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(() => {
    setVisible(false)
    setNotifyMessage({
      message: '',
      severity: 'info',
    })
  }, [setNotifyMessage])

    useEffect(() => {
        if (message) {
            setVisible(true)

            const timer = setTimeout(() => {
                handleClose()
            }, TIMEOUT)

            return () => clearTimeout(timer)
        }
    }, [handleClose, message])

  if (!visible || message === '') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: getBackgroundColor(severity),
        color: '#fff',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '90%',
        textAlign: 'center',
      }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        style={{
          marginLeft: '16px',
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ×
      </button>
    </div>
  )
}

function getBackgroundColor(severity: 'error' | 'info' | 'success' | 'warning'): string {
  switch (severity) {
    case 'success':
      return '#4caf50'
    case 'error':
      return '#f44336'
    case 'warning':
      return '#ff9800'
    case 'info':
      return '#2196f3'
    default:
      return '#323232'
  }
}