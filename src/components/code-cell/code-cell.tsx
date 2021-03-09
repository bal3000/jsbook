import { useEffect } from 'react';

import Resizable from '../resizable/resizable';
import CodeEditor from './code-editor/code-editor';
import Preview from './preview/preview';
import { Cell } from '../../state';
import { useActions } from '../../hooks';
import { useTypedSelector } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
  refreshRate?: number;
}

function CodeCell({ cell, refreshRate }: CodeCellProps) {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        createBundle(cell.id, cell.content);
      },
      refreshRate ? refreshRate : 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [cell.id, cell.content, createBundle, refreshRate]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onCodeChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {bundle && <Preview code={bundle.code} error={bundle.err} />}
      </div>
    </Resizable>
  );
}

export default CodeCell;
