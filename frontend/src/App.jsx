import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHome from "./pages/StudentHome";
import StudentMenu from "./pages/StudentMenu";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import StaffDashboard from "./pages/StaffDashboard";
import ManageFood from "./pages/ManageFood";
import ManageOrders from "./pages/ManageOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Student Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<StudentHome />} />
        <Route path="/menu" element={<StudentMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<MyOrders />} />

        {/* Staff Pages */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/food" element={<ManageFood />} />
        <Route path="/staff/orders" element={<ManageOrders />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;