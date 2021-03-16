import './action-bar.css';

import { useActions } from '../../hooks';
import ActionButton from './action-button/action-button';

interface ActionBarProps {
  id: string;
}

function ActionBar({ id }: ActionBarProps) {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className='action-bar'>
      <ActionButton
        iconClass={'fa-arrow-up'}
        onButtonClick={() => moveCell(id, 'up')}
      />
      <ActionButton
        iconClass={'fa-arrow-down'}
        onButtonClick={() => moveCell(id, 'down')}
      />
      <ActionButton
        iconClass={'fa-times'}
        onButtonClick={() => deleteCell(id)}
      />
    </div>
  );
}

export default ActionBar;
