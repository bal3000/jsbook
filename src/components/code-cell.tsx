import { useState, useEffect } from 'react';
import Resizable from './resizable';

import bundler from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';

interface CodeCellProps {
  refreshRate?: number;
}

function CodeCell({ refreshRate }: CodeCellProps) {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        const converted = await bundler(input);
        setCode(converted);
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
        <Preview code={code} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
