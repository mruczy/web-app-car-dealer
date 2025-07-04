import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom";

import Home from './pages/Home';
import Clients from './pages/Clients';
import ClientsAdd from './pages/ClientsAdd';
import ClientsEdit from './pages/ClientsEdit';
import Vehicles from './pages/Vehicles';
import VehiclesAdd from './pages/VehiclesAdd';
import VehiclesEdit from './pages/VehiclesEdit';
import Inventory from './pages/Inventory';
import InventoryAdd from './pages/InventoryAdd';
import InventoryEdit from './pages/InventoryEdit';
import Orders from './pages/Orders';
import OrdersAdd from './pages/OrdersAdd';
import OrdersEdit from './pages/OrdersEdit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import "./style.scss"

const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/clients",
        element: <Clients/>
      },
      {
        path: "/clients/add",
        element: <ClientsAdd/>
      },
      {
        path: "/clients/edit/:id",
        element: <ClientsEdit/>
      },
      {
        path: "/vehicles",
        element: <Vehicles/>
      },
      {
        path: "/vehicles/add",
        element: <VehiclesAdd/>
      },
      {
        path: "/vehicles/edit/:id",
        element: <VehiclesEdit/>
      },
      {
        path: "/inventory",
        element: <Inventory/>
      },
      {
        path: "/inventory/add",
        element: <InventoryAdd/>
      },
      {
        path: "/inventory/edit/:id",
        element: <InventoryEdit/>
      },
      {
        path: "/orders",
        element: <Orders/>
      },
      {
        path: "/orders/add",
        element: <OrdersAdd/>
      },
      {
        path: "/orders/edit/:id",
        element: <OrdersEdit/>
      },
    ]
  }
])

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}


export default App;
