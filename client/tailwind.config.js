import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        resuem: {
          bg: 'var(--color-bg)',
          'bg-subtle': 'var(--color-bg-subtle)',
          surface: 'var(--color-surface)',
          'surface-raised': 'var(--color-surface-raised)',
          'surface-overlay': 'var(--color-surface-overlay)',
          border: 'var(--color-border)',
          'border-strong': 'var(--color-border-strong)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          'accent-bright': 'var(--color-accent-bright)',
          'accent-dim': 'var(--color-accent-dim)',
          success: 'var(--color-success)',
          'success-dim': 'var(--color-success-dim)',
          warning: 'var(--color-warning)',
          'warning-dim': 'var(--color-warning-dim)',
          error: 'var(--color-error)',
          'error-dim': 'var(--color-error-dim)',
          before: 'var(--color-before)',
          after: 'var(--color-after)',
        },
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        section: 'var(--space-section)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      maxWidth: {
        editorial: '72rem',
        prose: '42rem',
        content: '48rem',
      },
      transitionTimingFunction: {
        editorial: 'var(--ease-out)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
};
