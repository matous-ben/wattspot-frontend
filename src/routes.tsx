import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AppliancesPage } from './pages/AppliancesPage'
import { DashboardPage } from './pages/DashboardPage'
import { PricesPage } from './pages/PricesPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { SettingsPage } from './pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'prices', element: <PricesPage /> },
      { path: 'recommendations', element: <RecommendationsPage /> },
      { path: 'appliances', element: <AppliancesPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
