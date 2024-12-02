import React, { FC, useState } from 'react';



interface CodeInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void; // Expects only the value
  rows?: number;
  cols?: number;
}

const CodeInput: FC<CodeInputProps> = ({
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
    if (onChange) onChange(newValue); // Pass only the string value
  };

  return (
    <div>
      <label>
        {label}
        <textarea
          placeholder={placeholder}
          value={text}
          onChange={}
          rows={rows}
          cols={cols}
        />
      </label>
    </div>
  );
};

export default CodeInput;
