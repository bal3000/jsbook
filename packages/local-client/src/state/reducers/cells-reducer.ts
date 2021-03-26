import produce from 'immer';
import { ActionType } from '../action-types';
import { Actions } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  data: { [key: string]: Cell };
  loading: boolean;
  error: string | null;
  order: string[];
}

const initialState: CellsState = {
  data: {},
  loading: false,
  error: null,
  order: [],
};

const reducer = produce((state: CellsState = initialState, action: Actions) => {
  switch (action.type) {
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;
    case ActionType.FETCH_CELLS_COMPLETE:
      state.loading = false;
      state.order = action.payload.map((c) => c.id);
      state.data = action.payload.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {} as CellsState['data']);
      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((o) => o === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        id: randomId(),
        type: action.payload.type,
        content: '',
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex((o) => o === action.payload.id);
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;
    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
