import { useState, useEffect, useRef } from 'react';

interface Props {
  selectedVibes: string[];
  selectedPace: string;
  onVibeToggle: (vibe: string) => void;
  onVibeEdit?: (oldVibe: string, newVibe: string | null) => void;
  onPaceSelect: (pace: string) => void;
}

const presetVibes = ['Food Trip', 'Relaxation', 'Adventure', 'Heritage', 'Cultural', 'Wellness', 'Shopping'];
const paces = ['Relaxed', 'Moderate', 'Packed', 'Spontaneous'];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border font-label-sm text-label-sm shadow-sm flex items-center gap-1 transition-all ${
        active
          ? 'border-secondary bg-secondary-container text-on-secondary-container'
          : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
      }`}
    >
      {active && (
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
      )}
      {label}
    </button>
  );
}

export default function VibePicker({ selectedVibes, selectedPace, onVibeToggle, onVibeEdit, onPaceSelect }: Props) {
  const [customVibes, setCustomVibes] = useState<string[]>(() => {
    const saved = localStorage.getItem('tuklas_custom_vibes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [newVibe, setNewVibe] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('tuklas_custom_vibes', JSON.stringify(customVibes));
  }, [customVibes]);

  useEffect(() => {
    if ((isAdding || editingIndex !== null) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, editingIndex]);

  const handleAddSubmit = () => {
    const val = newVibe.trim();
    if (val && !presetVibes.includes(val) && !customVibes.includes(val)) {
      setCustomVibes([...customVibes, val]);
      onVibeToggle(val); // automatically select it
    }
    setNewVibe('');
    setIsAdding(false);
  };

  const handleEditSubmit = (idx: number) => {
    const val = editValue.trim();
    const oldVal = customVibes[idx];
    
    if (!val) {
      // delete if empty
      const next = [...customVibes];
      next.splice(idx, 1);
      setCustomVibes(next);
      if (onVibeEdit) onVibeEdit(oldVal, null);
    } else if (val !== oldVal && !presetVibes.includes(val) && !customVibes.includes(val)) {
      // update
      const next = [...customVibes];
      next[idx] = val;
      setCustomVibes(next);
      if (onVibeEdit) onVibeEdit(oldVal, val);
    }
    setEditingIndex(null);
  };

  const handleDelete = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const oldVal = customVibes[idx];
    const next = [...customVibes];
    next.splice(idx, 1);
    setCustomVibes(next);
    if (onVibeEdit) onVibeEdit(oldVal, null);
  };

  return (
    <div className="space-y-sm">
      <h2 className="font-headline-md text-headline-md text-primary">The Vibe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        {/* Primary Purpose */}
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Primary Purpose</p>
          <div className="flex flex-wrap gap-2 items-center">
            {presetVibes.map((v) => (
              <Chip
                key={v}
                label={v}
                active={selectedVibes.includes(v)}
                onClick={() => onVibeToggle(v)}
              />
            ))}
            
            {/* Custom Vibes */}
            {customVibes.map((v, i) => {
              if (editingIndex === i) {
                return (
                  <input
                    key={`edit-${i}`}
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditSubmit(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit(i);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    className="px-3 py-1 rounded-full border border-primary text-label-sm outline-none w-28 bg-surface text-on-surface"
                  />
                );
              }
              const active = selectedVibes.includes(v);
              return (
                <div
                  key={`chip-${v}-${i}`}
                  className={`flex items-center rounded-full border shadow-sm transition-all overflow-hidden ${
                    active
                      ? 'border-secondary bg-secondary-container text-on-secondary-container'
                      : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <button
                    onClick={() => onVibeToggle(v)}
                    className="px-3 py-1.5 font-label-sm text-label-sm flex items-center gap-1 hover:opacity-80"
                  >
                    {active && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>}
                    {v}
                  </button>
                  <div className="flex items-center border-l border-outline-variant/30 px-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditValue(v); setEditingIndex(i); }}
                      className="p-1 hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(i, e)}
                      className="p-1 hover:text-error transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add Custom Button */}
            {isAdding ? (
              <input
                ref={inputRef}
                type="text"
                value={newVibe}
                onChange={(e) => setNewVibe(e.target.value)}
                onBlur={handleAddSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubmit();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
                placeholder="Type vibe..."
                className="px-3 py-1 rounded-full border border-primary text-label-sm outline-none w-28 bg-surface text-on-surface"
              />
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="px-3 py-1.5 rounded-full border border-dashed border-outline font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 hover:border-primary hover:text-primary transition-colors bg-transparent"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                Add Custom
              </button>
            )}
          </div>
        </div>

        {/* Pace */}
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Pace</p>
          <div className="flex flex-wrap gap-2">
            {paces.map((p) => (
              <Chip
                key={p}
                label={p}
                active={selectedPace === p}
                onClick={() => onPaceSelect(p)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
