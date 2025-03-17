import React, { useState } from 'react'
import { StoryObj, Meta } from '@storybook/react'
import { fn, userEvent, screen, within } from '@storybook/test'

import { Dialog } from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

// Basic Dialog
export const Basic: Story = {
  args: {
    open: true,
    title: 'Dialog Title',
    children: <p>This is a basic dialog with a title and content.</p>,
  },
}

// Dialog with actions
export const WithActions: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    children: <p>Are you sure you want to proceed with this action?</p>,
    actions: (
      <>
        <button
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Confirm
        </button>
      </>
    ),
  },
}

// Different sizes
export const SmallDialog: Story = {
  args: {
    open: true,
    title: 'Small Dialog',
    children: <p>This is a small dialog.</p>,
    size: 'small',
  },
}

export const LargeDialog: Story = {
  args: {
    open: true,
    title: 'Large Dialog',
    children: (
      <div>
        <p>This is a large dialog with more content.</p>
        <p>It has multiple paragraphs to demonstrate the larger size.</p>
        <p>You can fit more content in a large dialog.</p>
      </div>
    ),
    size: 'large',
  },
}

export const FullscreenDialog: Story = {
  args: {
    open: true,
    title: 'Fullscreen Dialog',
    children: (
      <div style={{ padding: '20px' }}>
        <h3>Fullscreen Content</h3>
        <p>This dialog takes up the entire screen.</p>
        <p>It's useful for mobile views or when you need to display a lot of content.</p>
        <div
          style={{
            height: '200px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <p>Additional content area</p>
        </div>
      </div>
    ),
    size: 'fullscreen',
  },
}

// Dialog with long content (scrolling)
export const ScrollingContent: Story = {
  args: {
    open: true,
    title: 'Scrolling Content',
    children: (
      <div>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>
            This is paragraph {i + 1}. It contains some text to demonstrate scrolling in the dialog.
          </p>
        ))}
      </div>
    ),
  },
}

// Dialog without a title
export const WithoutTitle: Story = {
  args: {
    open: true,
    children: <p>This dialog has no title, only content.</p>,
  },
}

// Dialog without close button
export const WithoutCloseButton: Story = {
  args: {
    open: true,
    title: 'No Close Button',
    children: <p>This dialog doesn't have a close button in the header.</p>,
    showCloseButton: false,
  },
}

// Dialog with custom width
export const CustomWidth: Story = {
  args: {
    open: true,
    title: 'Custom Width',
    children: <p>This dialog has a custom maximum width of 300px.</p>,
    maxWidth: 300,
  },
}

// Interactive Dialog
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export const InteractiveDialog: Story = {
  args: {
    open: false,
    children: <></>,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
      setIsOpen(false)
    }

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open Dialog
        </button>

        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          title="Interactive Dialog"
          actions={
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
            </>
          }
        >
          <p>This is an interactive dialog that you can open and close.</p>
        </Dialog>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open Dialog' }))
  },
}

export const InteractiveDialogWithCloseButton: Story = {
  ...InteractiveDialog,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open Dialog' }))
    await sleep(2000)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
  },
}

// Form Dialog
export const FormDialog: Story = {
  args: {
    open: false,
    children: <></>,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    })

    const handleClose = () => {
      setIsOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(`Form submitted with: ${JSON.stringify(formData, null, 2)}`)
      handleClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open Form Dialog
        </button>

        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          title="Contact Form"
          actions={
            <>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="contact-form"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            </>
          }
        >
          <form id="contact-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  minHeight: '100px',
                }}
                required
              />
            </div>
          </form>
        </Dialog>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open Form Dialog' }))
  },
}

// Nested Dialogs
export const NestedDialogs: Story = {
  args: {
    open: false,
    children: <></>,
  },
  render: (args) => {
    const [isPrimaryOpen, setPrimaryOpen] = useState(false)
    const [isSecondaryOpen, setSecondaryOpen] = useState(false)

    return (
      <div>
        <button
          onClick={() => setPrimaryOpen(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open Primary Dialog
        </button>

        <Dialog
          {...args}
          open={isPrimaryOpen}
          onClose={() => setPrimaryOpen(false)}
          title="Primary Dialog"
        >
          <div>
            <p>This is the primary dialog.</p>
            <button
              onClick={() => setSecondaryOpen(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '16px',
                cursor: 'pointer',
              }}
            >
              Open Secondary Dialog
            </button>
          </div>
        </Dialog>

        <Dialog
          {...args}
          open={isSecondaryOpen}
          onClose={() => setSecondaryOpen(false)}
          title="Secondary Dialog"
          size="small"
        >
          <p>This is a secondary dialog that appears on top of the primary dialog.</p>
        </Dialog>
      </div>
    )
  },
}
