import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 전역 스타일
import './styles/global.css';

// 날씨 앱에 필요한 추가 설정
import axios from 'axios';

// API 기본 설정 (선택 사항)
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'https://apis.data.go.kr';
axios.defaults.headers.common['Accept'] = 'application/xml';

// React 18+ 방식으로 루트 생성
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA 지원을 위한 서비스 워커 등록 (선택 사항)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}