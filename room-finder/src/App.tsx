import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RoomListScreen } from './screens/room/RoomListScreen';
import { AdminScreen } from './screens/admin/AdminScreen';
import { RoomDetailScreen } from './screens/room/RoomDetailsScreen';

function App() {

	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Navigate to="/rooms" replace />} />
					
						<Route path="rooms">
							<Route index element={<RoomListScreen />} />
							{/* <Route path="/:roomId" element={<RoomDetailScreen/>} /> */}
						</Route>

						<Route path="favorites">

						</Route>

						<Route path="professor">

						</Route>

						<Route path="profile">

						</Route>

						<Route path="admin">
							<Route index element={<AdminScreen />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;