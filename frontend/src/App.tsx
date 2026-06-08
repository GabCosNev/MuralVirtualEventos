import { BrowserRouter, Routes} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
