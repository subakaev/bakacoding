import {
  useContext,
  createContext,
  FunctionComponent,
  useReducer,
  Reducer,
  Dispatch,
} from "react";
import _ from "lodash";
import { Difficulty } from "types/contentful/CodingCard";

export interface CodingCardsFilter {
  difficulty: Difficulty;
}

export enum CodingCardsStateStatus {
  Initial = "initial",
  Loading = "loading",
  Loaded = "loaded",
  Error = "error",
}

interface CodingCardsState {
  filter?: CodingCardsFilter;
  slugs: string[];
  nextSlug?: string;
  status: CodingCardsStateStatus;
}

export enum CodingCardsActionType {
  CARDS_LOADING = "CARDS_LOADING",
  CARDS_LOADED = "CARDS_LOADED",
  ERROR = "ERROR",
}

type CodingCardsAction =
  | { type: CodingCardsActionType.CARDS_LOADING }
  | { type: CodingCardsActionType.ERROR }
  | {
      type: CodingCardsActionType.CARDS_LOADED;
      payload: { slugs: string[]; filter: CodingCardsFilter };
    };

interface CodingCardsContextProps {
  state: CodingCardsState;
  dispatch: Dispatch<CodingCardsAction>;
}

const CodingCardsContext = createContext<CodingCardsContextProps | null>(null);
CodingCardsContext.displayName = "CodingCardsContext";

export const useCodingCardsContext = () => {
  const context = useContext(CodingCardsContext);

  if (!context) {
    throw new Error(
      "CodingCardsContext must be use within CodingCardsProvider"
    );
  }

  return context;
};

const defaultState: CodingCardsState = {
  slugs: [],
  status: CodingCardsStateStatus.Initial,
};

const codingCardsReducer = (
  state: CodingCardsState,
  action: CodingCardsAction
) => {
  switch (action.type) {
    case CodingCardsActionType.CARDS_LOADING: {
      return { ...defaultState, status: CodingCardsStateStatus.Loading };
    }
    case CodingCardsActionType.ERROR: {
      return { ...defaultState, status: CodingCardsStateStatus.Error };
    }
    case CodingCardsActionType.CARDS_LOADED:
      const slugs = _.shuffle(action.payload.slugs);
      return {
        ...state,
        slugs,
        status: CodingCardsStateStatus.Loaded,
        ...(slugs.length > 0 && { nextSlug: slugs[0] }),
      };
    default:
      throw new Error(`Unsopported action type: ${action["type"]}`);
  }
};

const CodingCardsProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<
    Reducer<CodingCardsState, CodingCardsAction>
  >(codingCardsReducer, defaultState);

  return (
    <CodingCardsContext.Provider value={{ state, dispatch }}>
      {children}
    </CodingCardsContext.Provider>
  );
};

export default CodingCardsProvider;
