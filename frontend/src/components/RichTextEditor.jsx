import { useEffect, useRef } from 'react';

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write here...',
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const runCommand = (command, commandValue = null) => {
    focusEditor();
    document.execCommand(command, false, commandValue);
    updateValue();
  };

  const addLink = () => {
    focusEditor();

    const url = window.prompt('Enter the link URL');
    if (!url) return;

    const finalUrl =
      url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

    document.execCommand('createLink', false, finalUrl);
    updateValue();
  };

  const clearEditor = () => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = '';
    onChange('');
    editorRef.current.focus();
  };

  const handleInput = () => {
    updateValue();
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);

    updateValue();
  };

  return (
    <div className="rich-editor-box">
      <div className="rich-toolbar">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>

        <span className="rich-divider" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('insertUnorderedList')}
          title="Bullet list"
        >
          • List
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('insertOrderedList')}
          title="Numbered list"
        >
          1. List
        </button>

        <span className="rich-divider" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
          title="Add link"
        >
          Link
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand('undo')}
          title="Undo"
        >
          Undo
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearEditor}
          title="Clear editor"
        >
          Clear
        </button>
      </div>

      <div
        ref={editorRef}
        className="rich-editor-input"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
      />
    </div>
  );
}