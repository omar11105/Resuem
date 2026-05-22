const SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'summary', label: 'Summary' },
];

export default function SectionSelector({ selected = [], onChange }) {
  const toggle = (id) => {
    if (selected.includes(id) && selected.length <= 1) {
      return;
    }
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange?.(next);
  };

  return (
    <fieldset className="space-y-md">
      <legend className="label-editorial">Sections to tailor</legend>
      <div className="flex flex-wrap gap-md">
        {SECTIONS.map(({ id, label }) => {
          const checked = selected.includes(id);
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-sm border px-lg py-md text-sm transition-colors duration-fast ${
                checked
                  ? 'border-resuem-accent bg-resuem-accent-dim text-resuem-text'
                  : 'border-resuem-border bg-resuem-surface text-resuem-text-secondary hover:border-resuem-border-strong'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(id)}
                className="h-3.5 w-3.5 border-resuem-border-strong bg-resuem-bg text-resuem-accent focus:ring-resuem-accent focus:ring-offset-0"
              />
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
