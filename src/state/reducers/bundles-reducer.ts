import produce from 'immer';
import { ActionType } from '../action-types';
import { Actions } from '../actions';

interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    err: string;
  };
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Actions) => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        const { cellId } = action.payload;
        state[cellId] = { code: '', err: '', loading: true };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        const {
          bundle: { code, err },
        } = action.payload;
        const id = action.payload.cellId;
        state[id] = { code, err, loading: false };
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
