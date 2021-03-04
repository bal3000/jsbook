import { useTypedSelector } from '../hooks';
import CellListItem from './cell-list-item';

function CellList() {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
}

export default CellList;