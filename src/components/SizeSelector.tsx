import React, { useState } from "react";

type SizeOption = 32 | 64 | 128;

export default function SizeSelector({
  onChange,
}: {
  onChange?: (value: SizeOption) => void;
}) {
  const [value, setValue] = useState<SizeOption>(64);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(event.target.value, 10) as SizeOption;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <p>Size:</p>
      <select
        value={value}
        onChange={handleChange}
        className="p-2 rounded border"
      >
        <option value={32}>Small</option>
        <option value={64}>Medium</option>
        <option value={128}>Large</option>
      </select>
    </div>
  );
}
