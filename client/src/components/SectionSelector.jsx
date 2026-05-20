const SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'summary', label: 'Summary' },
];

export default function SectionSelector({ selected = [], onChange }) {
  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange?.(next);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-polished-800">
        Sections to tailor
      </legend>
      <div className="flex flex-wrap gap-4">
        {SECTIONS.map(({ id, label }) => (
          <label
            key={id}
            className="flex cursor-pointer items-center gap-2 text-sm text-polished-700"
          >
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
              className="h-4 w-4 rounded border-polished-300 text-polished-900 focus:ring-polished-500"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
