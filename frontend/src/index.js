import React from "react";
import ReactDOM from "react-dom/client"; // React 18 用のモジュールをインポート
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // React Router のモジュールをインポート
import App from "./App";
import LicenseProcess from "./LicenseProcess";
import CreditCardProcess from "./CreditCardProcess";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // React 18 の新しい root API を使用

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />{" "}
      {/* ルートパスに対するコンポーネント */}
      <Route path="/id" element={<LicenseProcess />} />{" "}
      {/* "/id" パスに対するコンポーネント */}
      <Route path="/card" element={<CreditCardProcess />} />{" "}
      {/* "/card" パスに対するコンポーネント */}
    </Routes>
  </Router>
);
