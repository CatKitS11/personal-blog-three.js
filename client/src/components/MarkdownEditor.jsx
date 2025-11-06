import { memo } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useContentImageUpload } from '@/hooks/useContentImageUpload';

const MarkdownEditor = memo(({ value, onChange, placeholder }) => {
  const { uploadContentImage, uploading } = useContentImageUpload();

  // Custom command for image upload
  const imageUploadCommand = {
    name: 'upload-image',
    keyCommand: 'upload-image',
    buttonProps: { 'aria-label': 'Upload image', title: 'Upload image' },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          try {
            const imageUrl = await uploadContentImage(file);
            if (imageUrl) {
              const imageMarkdown = `![${file.name}](${imageUrl})`;
              const newValue = state.text.substring(0, state.selection.start) + 
                             imageMarkdown + 
                             state.text.substring(state.selection.end);
              api.setSelectionRange({
                start: state.selection.start,
                end: state.selection.start + imageMarkdown.length,
              });
              onChange(newValue);
            }
          } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
          }
        }
      };
      input.click();
    },
  };

  return (
    <div className="markdown-editor-wrapper" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        height={500}
        hideToolbar={false}
        highlightEnable={false}
        placeholder={placeholder}
        commands={[
          // Basic formatting
          'bold', 'italic', 'strikethrough', 'hr',
          // Headers
          'title', 'divider',
          // Lists
          'unorderedListCommand', 'orderedListCommand', 'checkedListCommand',
          'divider',
          // Links and images
          'link', 'quote', 'code', 'image',
          // Custom upload command
          imageUploadCommand,
          'divider',
          // View controls
          'fullscreen'
        ]}
        extraCommands={[]}
      />
      {uploading && (
        <div className="mt-2 px-3 py-2 bg-blue-50 text-blue-600 text-sm rounded">
          📤 Uploading image...
        </div>
      )}
      <style>{`
        .markdown-editor-wrapper {
          border-radius: 8px;
          overflow: hidden;
        }
        .markdown-editor-wrapper .w-md-editor {
          border-radius: 8px;
        }
        .markdown-editor-wrapper .w-md-editor-toolbar {
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        .markdown-editor-wrapper .w-md-editor-content {
          background: white;
        }
        .markdown-editor-wrapper .w-md-editor-content .w-md-editor-text-input {
          min-height: 450px;
        }
        .markdown-editor-wrapper .w-md-editor-preview {
          background: #fafafa;
        }
      `}</style>
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;

