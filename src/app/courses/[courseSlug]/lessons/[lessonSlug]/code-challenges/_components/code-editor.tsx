"use client";

import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

interface CodeEditorProps {
  code?: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <section className="card mt-3">
      <h2>Your Solution</h2>
      <div className="card-body">
        <CodeMirror
          editable={true}
          extensions={[python()]}
          height="300px"
          onChange={(value) => onChange(value)}
          value={code}
        />
      </div>
    </section>
  );
}
