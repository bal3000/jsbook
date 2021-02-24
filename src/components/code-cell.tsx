import { useState } from 'react';

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
    <div>
      <CodeEditor initialValue='' onCodeChange={(value) => setInput(value)} />
      <div>
        <button onClick={onSetCode}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
}

export default CodeCell;
