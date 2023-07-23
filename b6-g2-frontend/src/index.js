import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />}></Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
);
