import { Cell } from '../state';
import CodeCell from './code-cell/code-cell';
import TextEditor from './text-editor/text-editor';

interface CellListItemProps {
  cell: Cell;
}

function CellListItem({ cell }: CellListItemProps) {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = <CodeCell cell={cell} refreshRate={1000} />;
  } else {
    child = <TextEditor cell={cell} />;
  }

  return <div>{child}</div>;
}

export default CellListItem;
