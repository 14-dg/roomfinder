import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RoomListScreen } from "./screens/room/RoomListScreen";
import { AdminScreen } from "./screens/admin/AdminScreen";
import { FavouritesScreen } from "./screens/favourites/FavouritesScreen";
import { LecturerScreen } from "./screens/lecturer/LecturerScreen";
import { ProfileScreen } from "./screens/profile/ProfileScreen";
import { BookingScreen } from "./screens/bookings/BookingScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginScreen } from "./screens/login/LoginScreen";

const queryClient = new QueryClient();

function App() {

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						
						<Route path="/login" element={<LoginScreen />} />

						<Route path="/" element={<Layout />}>

							<Route index element={<Navigate to="/rooms" replace />} />

							<Route element={<ProtectedRoute allowedRoles={["guest", "student", "lecturer", "admin"]} />}>
								<Route path="rooms" element={<RoomListScreen />} />
								{/* <Route path="rooms/:id" element={<RoomDetailScreen />} /> */}
								<Route path="lecturers" element={<LecturerScreen />} />
								<Route path="profile" element={<ProfileScreen />} />
							</Route>

							<Route element={<ProtectedRoute allowedRoles={["student", "lecturer", "admin"]} />}>
								<Route path="favorites" element={<FavouritesScreen />} />
							</Route>

							<Route element={<ProtectedRoute allowedRoles={["lecturer", "admin"]} />}>
								<Route path="bookings" element={<BookingScreen />} />
							</Route>
							
							<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
								<Route path="admin" element={<AdminScreen />} />
							</Route>

						</Route>

						{/* Fallback für falsche URLs (404) */}
						<Route path="*" element={<Navigate to="/rooms" replace />} />

					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;