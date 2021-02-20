import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin, fetchPlugin } from './plugins';
import CodeEditor from './components/code-editor';

function App(): JSX.Element {
  const [input, setInput] = useState('');
  const serviceRef = useRef<esbuild.Service>();
  const iframe = useRef<any>();

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onSetCode = async () => {
    if (!serviceRef.current) {
      return;
    }

    iframe.current.srcdoc = html;

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
    iframe.current.contentWindow.postMessage(
      converted.outputFiles[0].text,
      '*'
    );
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor />
      <textarea
        value={input}
        onChange={({ target }) => setInput(target.value)}
      ></textarea>
      <div>
        <button onClick={onSetCode}>Submit</button>
      </div>
      <iframe
        ref={iframe}
        title='code'
        srcDoc={html}
        sandbox='allow-scripts'
      ></iframe>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
