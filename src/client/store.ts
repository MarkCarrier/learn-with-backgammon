import { IChecker, IBackgammonGameState, START_LAYOUT } from "./backgammon"


//Redux
import { createStore, Store, AnyAction } from "redux"

//Rx
import {
  from,
  Observable,
  ObservableInput,
  Subject,
  merge,
  ConnectableObservable,
  of,
} from "rxjs"
import {
  map,
  publishBehavior,
  refCount,
  filter,
  publish,
  tap,
} from "rxjs/operators"

const startLayout = JSON.parse(JSON.stringify(START_LAYOUT)).filter((i: IChecker) => i != null)

export const store = createStore(reduxReducer, {
  layout: startLayout,
  moves: []
})
const observableStore = createStreamFromStore(store)
observableStore.subscribe((state: IBackgammonGameState) => {
  console.log(JSON.stringify(state))
})

function createStreamFromStore(store: Store) {
  return from((store as unknown) as ObservableInput<any>).pipe(
    map(() => store.getState()),
    publishBehavior(store.getState()),
    refCount()
  )
}

declare module "rxjs" {
  interface Observable<T> {
    ofType(...types: Array<string>): Observable<T>
  }
}

Observable.prototype.ofType = function (
  ...types: Array<string>
): Observable<any> {
  return this.pipe(
    filter(({ type }) => {
      const len = types.length
      switch (len) {
        case 0:
          throw new Error("Need at least 1 type")
        case 1:
          return type === types[0]
        default:
          return types.indexOf(type) > -1
      }
    })
  )
}

function createPipedStoreDispatcher(store: Store, epics: Array<Epic>) {
  const input$ = new Subject<AnyAction>()
  const actions = epics.map((epic) => epic(input$, store))

  const allActions$ = merge(...actions)
  const sharedActions$ = publish()(allActions$)

  sharedActions$.subscribe(input$)
  sharedActions$.subscribe((action) => store.dispatch(action as AnyAction))
  const sub = sharedActions$.connect()

  return {
    dispatch: (action: AnyAction) => input$.next(action),
    unsubscribe: () => sub.unsubscribe(),
  }
}

function reduxReducer(
  state: IBackgammonGameState = { layout: [], moves: [] },
  action: AnyAction
) {
  switch (action.type) {
    case "DICEROLL":
      return {
        ...state,
        moves: state.moves.concat({
          isWhitePlayer: action.isWhitePlayer,
          diceValues: action.diceValues,
        }),
      }
    case "PLAY":
      return {
        ...state,
        moves: state.moves.concat({
          isWhitePlayer: action.isWhitePlayer,
          diceValue: action.diceValue,
          targetPoint: action.targetPoint,
        }),
      }
    case "TEST":
      console.log(`TEST ACION REDUCED: ${action.msg}`)
      return {
        ...state,
      }
    default:
      return state
  }
}

type Epic = <T>(
  action$: Observable<AnyAction>,
  store: Store
) => Observable<AnyAction>

const sampleAction: AnyAction = {
  type: "TEST",
  msg: "Howdy",
}

function playEpic(action$: Observable<AnyAction>, store: Store) {
  return action$.ofType("PLAYED").pipe(
    tap((action) => {
      console.log(`Play epic handling action ${JSON.stringify(action,null," ")}`)
    }),
    map((action) => {
      return {
        type: "TEST",
        msg: "Hiya",
      }
    })
  )
}

const dispatch = createPipedStoreDispatcher(store, [playEpic])

dispatch.dispatch({
  type: "PLAYED",
  point: 1,
  diceValue: 3,
})
