import { useState, useEffect } from 'react';
import Resizable from '../resizable/resizable';

import bundler from '../../bundler';
import CodeEditor from './code-editor/code-editor';
import Preview from './preview/preview';

interface CodeCellProps {
  refreshRate?: number;
}

function CodeCell({ refreshRate }: CodeCellProps) {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        const bundle = await bundler(input);
        setCode(bundle.code);
        setError(bundle.err);
      },
      refreshRate ? refreshRate : 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [input, refreshRate]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue=''
            onCodeChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
