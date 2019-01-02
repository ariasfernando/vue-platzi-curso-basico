/**
 * # List styles loss fix.
 * Sometimes when removing the "listness" from a list, some styles get lost.
 * That is because those styles are set in the "LI"s which are removed and are not copied anywhere.
 * This fix just copies those styles to the new parents of the LIs' children.
 *
 * This fix works saving a reference to the LIs before removing the list (on the BeforeExecCommand event)
 * and restoring the styles on the
 */

/**
 * Helper function that just applies styles in the (prop: value;) format to an element
 */
const applyStyles = (target, styles) =>
    styles
        .split(';')
        .map(styleDeclaration =>
            styleDeclaration
                .split(':')
                .map(text =>
                    text.trim(),
                ),
        )
        .forEach(([prop, value]) =>
            target.style.setProperty(prop, value),
        )
;

/**
 * Gets the styles from the LIs and sets an event to apply them again to the new
 * content's parents.
 */
const preserveListStyles = (beforeEvent, editor) => {
  // Get the list type based on the command
  let listType = '';
  switch (beforeEvent.command) {
    case 'InsertUnorderedList':
      listType = 'UL';
      break;
    case 'InsertOrderedList':
      listType = 'OL';
      break;
    case 'InsertDefinitionList':
      listType = 'DL';
      break;
    default:
      // We don't care about this command
      return;
  }

  // Get the list
  const list = editor.dom.getParent(editor.selection.getStart(), 'OL,UL,DL');

  // If there is no list of the expected type (e.g. list adding instead of removing), just return
  if (!list || list === editor.getBody() || list.nodeName !== listType) {
    return;
  }

  // Keep a reference of each LI first children (to get to its new parent after the list removing)
  // ...and a reference to the styles hold by the LI.
  const listItems = Array.from(list.children)
      .filter(li => li.nodeName === 'LI')
      .map(li => ({
        firstChild: li.firstChild,
        styles: li.getAttribute('data-mce-style'),
      }))
      .filter(liData => liData.firstChild && liData.styles);

  // Listener that will restore the styles
  const restoreStyles = (execEvent) => {
    // Should only execute for the same command that the beforeExecCommand event
    if (execEvent.command !== beforeEvent.command) {
      return;
    }

    // Remove this event after execution
    // (I avoided to use `.once` editor's method to guarantee the execution, as we have a previous `return`)
    editor.off('ExecCommand', restoreStyles);

    // Just apply the styles for each LI content's new parent
    listItems.forEach(li => applyStyles(li.firstChild.parentNode, li.styles));
  };

  // Add the restoreStyles listener
  editor.on('ExecCommand', restoreStyles);
};

export default (editor) => {
  // Add the fix on the BeforeExecCommandEvent
  editor.on('BeforeExecCommand', e => preserveListStyles(e, editor));
};
