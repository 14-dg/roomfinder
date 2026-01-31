import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'

function App() {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        
      </Router>
    </QueryClientProvider>
  );
}

export default App;