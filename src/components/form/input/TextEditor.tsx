"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import React from "react";

interface ReactQuillEditorProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReactQuillEditor: React.FC<ReactQuillEditorProps> = ({
  name,
  value,
  placeholder = "Enter description",
  onChange,
}) => {
  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    // ✅ Plain text
    const plainText = editor.getText();

    // Agar tumhe HTML chahiye to use 'content'
    // Agar plain text chahiye to use 'plainText'
    const event = {
      target: {
        name,
        value: plainText.trim(), // 🔁 only text
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(event);
  };

  return (
    <div className="min-h-[200px]">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white dark:bg-gray-900"
      />
    </div>
  );
};

export default ReactQuillEditor;
