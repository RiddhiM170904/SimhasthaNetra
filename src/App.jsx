import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Overview from './pages/Overview.jsx';
import CrowdHeatmap from './pages/CrowdHeatmap.jsx';
import Incidents from './pages/Incidents.jsx';
import Transport from './pages/Transport.jsx';
import Health from './pages/Health.jsx';
import Volunteers from './pages/Volunteers.jsx';
import Resources from './pages/Resources.jsx';
import Reports from './pages/Reports.jsx';
import { useRole } from './context/RoleContext.jsx';

export default function App() {
  const { role } = useRole();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={role ? <DashboardLayout /> : <Navigate to="/" />}>
        <Route index        element={<Overview />} />
        <Route path="crowd"      element={<CrowdHeatmap />} />
        <Route path="incidents"  element={<Incidents />} />
        <Route path="transport"  element={<Transport />} />
        <Route path="health"     element={<Health />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="resources"  element={<Resources />} />
        <Route path="reports"    element={<Reports />} />
        <Route path="settings"   element={<Overview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
