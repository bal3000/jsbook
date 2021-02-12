import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin, fetchPlugin } from './plugins';

function App(): JSX.Element {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const serviceRef = useRef<esbuild.Service>();

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onSetCode = async () => {
    if (!serviceRef.current) {
      return;
    }

    const converted = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    setCode(converted.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={({ target }) => setInput(target.value)}
      ></textarea>
      <div>
        <button onClick={onSetCode}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
