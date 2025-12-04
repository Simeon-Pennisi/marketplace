// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
//
// Here is code from ChatGPT
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
//
// Here is the code from the T10 Hello-Vite project
// import { StrictMode } from "react";
// import { ReactDOM } from "react-dom/client"; // never used
// import { createRoot } from "react-dom/client";
// import App from "./components/App.jsx";
// import "./index.css";

// // createRoot(document.getElementById("root")).render(
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
