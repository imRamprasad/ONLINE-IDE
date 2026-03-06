export const disableEditorClipboard = (editor) => {
  if (!editor) {
    return () => {};
  }

  editor.updateOptions({
    contextmenu: false,
    emptySelectionClipboard: false,
    copyWithSyntaxHighlighting: false,
  });

  const editorNode = editor.getDomNode();
  if (!editorNode) {
    return () => {};
  }

  const preventClipboardEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const usingModifier = event.ctrlKey || event.metaKey;
    const isBlockedShortcut =
      (usingModifier && ["c", "x", "v", "insert"].includes(key)) ||
      (event.shiftKey && key === "insert");

    if (isBlockedShortcut) {
      preventClipboardEvent(event);
    }
  };

  const blockedEvents = ["copy", "cut", "paste", "drop", "contextmenu"];

  editorNode.addEventListener("keydown", handleKeyDown, true);
  blockedEvents.forEach((eventName) => {
    editorNode.addEventListener(eventName, preventClipboardEvent, true);
  });

  return () => {
    editorNode.removeEventListener("keydown", handleKeyDown, true);
    blockedEvents.forEach((eventName) => {
      editorNode.removeEventListener(eventName, preventClipboardEvent, true);
    });
  };
};
