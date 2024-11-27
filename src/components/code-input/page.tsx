import React, { FC, useState } from 'react';

interface TextAreaProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  cols?: number;
}

const TextArea: FC<TextAreaProps> = ({
  label,
  placeholder = 'Enter text...',
  value = '',
  onChange,
  rows = 5,
  cols = 30,
}) => {
  const [text, setText] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div>
      <label>
        {label}
        <textarea
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          rows={rows}
          cols={cols}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </label>
    </div>
  );
};

export default TextArea;
