import { useState } from 'react';
import Resizable from './resizable';

import bundler from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';

function CodeCell() {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onSetCode = async () => {
    const converted = await bundler(input);
    setCode(converted);
  };

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
