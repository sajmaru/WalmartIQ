import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined as DashboardIcon,
  HouseOutlined as WarehouseDashboardIcon,
  CloudOutlined as WeatherDashboardIcon,
  FolderOpen as PDFDirectoryIcon,
  TrendingUpOutlined as RatesDashboardIcon,
} from '@mui/icons-material';

const Welcome = lazy(() => import('../views/Welcome'));
const Dashboard = lazy(() => import('../views/Dashboard'));
const WeatherDashboard = lazy(() => import('../views/WeatherDashboard'));
const WarehouseDashboard = lazy(() => import('../views/WarehouseDashboard'));
const PDFDirectory = lazy(() => import('../views/PDFDirectory'));
const RatesDashboard = lazy(() => import('../views/RatesDashboard'));

const dashboardVariants = [
  '/year/:year',
  '/crop/:cropCode',
  '/state/:stateCode',
  '/year/:year/crop/:cropCode',
  '/year/:year/state/:stateCode',
  '/state/:stateCode/crop/:cropCode',
  '/year/:year/state/:stateCode/crop/:cropCode',
];

export const pages = [
  {
    pageLink: '/',
    component: Dashboard,
    displayName: 'Production',
    showInNavbar: true,
    navbarIcon: DashboardIcon,
  },
  {
    pageLink: '/weather',
    component: WeatherDashboard,
    displayName: 'Weather',
    showInNavbar: true,
    navbarIcon: WeatherDashboardIcon,
  },
  {
    pageLink: '/warehouse',
    component: WarehouseDashboard,
    displayName: 'Warehouse',
    showInNavbar: true,
    navbarIcon: WarehouseDashboardIcon,
  },
  {
    pageLink: '/rates',
    component: RatesDashboard,
    displayName: 'Rates',
    showInNavbar: true,
    navbarIcon: RatesDashboardIcon,
  },
  {
    pageLink: '/directory',
    component: PDFDirectory,
    displayName: 'Directory',
    showInNavbar: true,
    navbarIcon: PDFDirectoryIcon,
  },
  {
    pageLink: '/welcome',
    component: Welcome,
  },
  {
    pageLink: '/warehouse/state/:stateCode',
    component: WarehouseDashboard,
    showInNavbar: false,
  },
  {
    pageLink: '/weather/state/:stateCode',
    component: WeatherDashboard,
    showInNavbar: false,
  },
  {
    pageLink: '/weather/year/:year',
    component: WeatherDashboard,
    showInNavbar: false,
  },
  {
    pageLink: '/weather/year/:year/state/:stateCode',
    component: WeatherDashboard,
    showInNavbar: false,
  },
  ...dashboardVariants.map((pageLink) => ({
    pageLink,
    component: Dashboard,
    showInNavbar: false,
  })),
];

const Router = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {pages.map((page) => (
        <Route
          key={page.pageLink}
          path={page.pageLink}
          element={<page.component />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;