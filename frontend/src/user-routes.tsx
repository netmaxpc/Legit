
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";



const App = lazy(() => import("./pages/App.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const History = lazy(() => import("./pages/History.tsx"));

export const userRoutes: RouteObject[] = [

	{ path: "/", element: <App />},
	{ path: "/dashboard", element: <Dashboard />},
	{ path: "/history", element: <History />},

];
