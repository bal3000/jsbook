import ReactDOM from 'react-dom';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

function App(): JSX.Element {
  return (
    <div>
      <TextEditor />
      <CodeCell refreshRate={1000} />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
