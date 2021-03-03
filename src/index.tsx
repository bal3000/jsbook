import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
        <CodeCell refreshRate={1000} />
      </div>
    </Provider>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
