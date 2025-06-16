import './theme/index.css';
import { Suspense } from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import App from '@/App';
import { HelmetProvider } from 'react-helmet-async';

const { error } = console;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const root: Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <HelmetProvider>
    <Suspense>
      <App />
    </Suspense>
  </HelmetProvider>,
);
