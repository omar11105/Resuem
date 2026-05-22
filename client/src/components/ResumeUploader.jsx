import { useCallback } from 'react';

export default function ResumeUploader({
  mode,
  onModeChange,
  pasteValue,
  onPasteChange,
  file,
  onFileChange,
}) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files?.[0];
      if (dropped?.type === 'application/pdf') {
        onFileChange?.(dropped);
      }
    },
    [onFileChange]
  );

  return (
    <div className="space-y-md">
      <div className="inline-flex border border-resuem-border p-xs">
        <button
          type="button"
          onClick={() => onModeChange?.('paste')}
          className={`px-md py-sm text-xs font-medium uppercase tracking-wider transition-colors duration-fast ${
            mode === 'paste'
              ? 'bg-resuem-accent-dim text-resuem-accent-bright'
              : 'text-resuem-muted hover:text-resuem-text-secondary'
          }`}
        >
          Paste text
        </button>
        <button
          type="button"
          onClick={() => onModeChange?.('pdf')}
          className={`px-md py-sm text-xs font-medium uppercase tracking-wider transition-colors duration-fast ${
            mode === 'pdf'
              ? 'bg-resuem-accent-dim text-resuem-accent-bright'
              : 'text-resuem-muted hover:text-resuem-text-secondary'
          }`}
        >
          Upload PDF
        </button>
      </div>

      {mode === 'paste' ? (
        <textarea
          value={pasteValue}
          onChange={(e) => onPasteChange?.(e.target.value)}
          placeholder="Paste your resume here..."
          rows={10}
          className="input-field min-h-[200px] resize-y font-mono text-[0.8125rem]"
        />
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-resuem-border-strong bg-resuem-surface px-lg py-2xl text-center transition-colors duration-fast hover:border-resuem-accent hover:bg-resuem-accent-dim"
        >
          <p className="text-sm text-resuem-text-secondary">
            Drop your PDF here (max 5MB)
          </p>
          <label className="mt-md cursor-pointer text-xs font-medium uppercase tracking-wider text-resuem-accent hover:text-resuem-accent-bright">
            or browse
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) onFileChange?.(selected);
              }}
            />
          </label>
          {file && (
            <p className="mt-md font-mono text-xs text-resuem-muted">{file.name}</p>
          )}
        </div>
      )}
    </div>
  );
}
