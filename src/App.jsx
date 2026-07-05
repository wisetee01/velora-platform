import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./navigation/AppRouter";

/**
 * Root Application Core Architecture Node.
 * Combines global authentication context states with security navigation routers.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
