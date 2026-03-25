import { Modal } from './Modal'
import { Button } from './Button'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="px-5 pb-5 pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button type="button" variant="secondary" fullWidth className="sm:w-auto" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            className="sm:w-auto"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-[var(--text)]">{message}</p>
    </Modal>
  )
}
