import { useEffect } from 'react';

import './code-cell.css';

import Resizable from '../resizable/resizable';
import CodeEditor from './code-editor/code-editor';
import Preview from './preview/preview';
import { Cell } from '../../state';
import { useActions } from '../../hooks';
import { useTypedSelector, useCumulativeCode } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
  refreshRate?: number;
}

function CodeCell({ cell, refreshRate }: CodeCellProps) {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumCode);
      return;
    }

    const timer = setTimeout(
      async () => {
        createBundle(cell.id, cumCode);
      },
      refreshRate ? refreshRate : 1000
    );

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumCode, createBundle, refreshRate]);

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
        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default CodeCell;
