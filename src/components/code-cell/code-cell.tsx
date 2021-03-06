import { useState, useEffect } from 'react';
import Resizable from '../resizable/resizable';

import bundler from '../../bundler';
import CodeEditor from './code-editor/code-editor';
import Preview from './preview/preview';
import { Cell } from '../../state';
import { useActions } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
  refreshRate?: number;
}

function CodeCell({ cell, refreshRate }: CodeCellProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        const bundle = await bundler(cell.content);
        setCode(bundle.code);
        setError(bundle.err);
      },
      refreshRate ? refreshRate : 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, refreshRate]);

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
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
