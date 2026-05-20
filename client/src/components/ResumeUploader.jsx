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
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange?.('paste')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'paste'
              ? 'bg-polished-900 text-white'
              : 'bg-polished-100 text-polished-700'
          }`}
        >
          Paste text
        </button>
        <button
          type="button"
          onClick={() => onModeChange?.('pdf')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'pdf'
              ? 'bg-polished-900 text-white'
              : 'bg-polished-100 text-polished-700'
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
          className="w-full rounded-xl border border-polished-200 bg-white px-4 py-3 text-sm focus:border-polished-500 focus:outline-none focus:ring-1 focus:ring-polished-500"
        />
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-polished-300 bg-polished-50 px-6 py-10 text-center"
        >
          <p className="text-sm text-polished-600">Drop your PDF here (max 5MB)</p>
          <label className="mt-3 cursor-pointer text-sm font-medium text-polished-900 underline">
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
            <p className="mt-2 text-xs text-polished-500">{file.name}</p>
          )}
        </div>
      )}
    </div>
  );
}
