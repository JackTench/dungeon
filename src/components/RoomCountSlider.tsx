import React, { useState } from "react";

export default function RoomCountSlider({
  onChange,
}: {
  onChange?: (value: number) => void;
}) {
  const [value, setValue] = useState<number>(8);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10) as number;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <p>Room Count:</p>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={2}
          max={25}
          value={value}
          onChange={handleChange}
          className="w-full accent-blue-600"
        />
        <output className="ml-2 font-semibold w-8 text-right">{value}</output>
      </div>
    </div>
  );
}
