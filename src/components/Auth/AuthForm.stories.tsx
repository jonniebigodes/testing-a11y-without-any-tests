import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'

import { LoginForm } from './AuthForm'

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: 'Components/AuthForm',
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {}

export const WithEmailFilled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const emailInput = canvas.getByLabelText('Email')
    await userEvent.type(emailInput, 'test@example.com')
  },
}

export const WithPasswordFilled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const passwordInput = canvas.getByLabelText('Password')
    await userEvent.type(passwordInput, 'password123')
  },
}

export const FilledForm: Story = {
  play: async (canvasContext) => {
    const canvas = within(canvasContext.canvasElement)
    // @ts-expect-error - Story play function might be undefined
    await WithEmailFilled.play(canvasContext)
    // @ts-expect-error - Story play function might be undefined
    await WithPasswordFilled.play(canvasContext)
    const submitButton = canvas.getByRole('button', { name: 'Login' })
    await userEvent.click(submitButton)
  },
}

export const OldFashionedFilledForm: Story = {
  play: async (canvasContext) => {
    const canvas = within(canvasContext.canvasElement)
    const emailInput = canvas.getByLabelText('Email')
    await userEvent.type(emailInput, 'test@example.com')
    const passwordInput = canvas.getByLabelText('Password')
    await userEvent.type(passwordInput, 'password123')
    const submitButton = canvas.getByRole('button', { name: 'Login' })
    await userEvent.click(submitButton)
  },
}
