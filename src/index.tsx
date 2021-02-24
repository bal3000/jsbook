import ReactDOM from 'react-dom';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell';

function App(): JSX.Element {
  return (
    <div>
      <CodeCell />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
