"use client";

import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

interface CodeEditorProps {
  code?: string;
}

export default function CodeEditor({ code = "" }: CodeEditorProps) {
  return (
    <section className="card mt-3">
      <h2>Your Solution</h2>
      <div className="card-body">
        <CodeMirror
          editable={true}
          extensions={[python()]}
          height="300px"
          value={code}
        />
      </div>
    </section>
  );
}
