import React from "react";

import "./index.css";
import PopupWithForm from "./components/PopupWithForm";

const App = ({children, ...props}) => (
  <PopupWithForm {...props}>
    {children}
  </PopupWithForm>
);

export default App;
