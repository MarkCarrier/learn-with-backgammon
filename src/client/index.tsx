// React
import * as React from "react"
import * as ReactDOM from "react-dom"

//Backgammon
import SVGBackgammonBoard from "./SVGBackgammonBoard"

//Redux
import { Provider } from "react-redux"

//Other
import { store } from "./store"

ReactDOM.render(
  <Provider store={store}>
    <SVGBackgammonBoard />
  </Provider>,
  document.getElementById("root")
)
