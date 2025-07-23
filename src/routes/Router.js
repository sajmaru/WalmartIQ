import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined as DashboardIcon,
  HouseOutlined as WarehouseDashboardIcon,
  CloudOutlined as WeatherDashboardIcon,
  FolderOpen as PDFDirectoryIcon,
  TrendingUpOutlined as PricingDashboardIcon,
} from '@mui/icons-material';

const Welcome = lazy(() => import('../views/Welcome'));
const Dashboard = lazy(() => import('../views/Dashboard'));
const WeatherDashboard = lazy(() => import('../views/WeatherDashboard'));
const WarehouseDashboard = lazy(() => import('../views/WarehouseDashboard'));
const PDFDirectory = lazy(() => import('../views/PDFDirectory'));
const PricingDashboard = lazy(() => import('../views/PricingDashboard'));

const dashboardVariants = [
  '/year/:year',
  '/sbu/:sbuCode',
  '/dept/:deptCode',
  '/state/:stateCode',
  '/year/:year/sbu/:sbuCode',
  '/year/:year/dept/:deptCode',
  '/year/:year/state/:stateCode',
  '/state/:stateCode/sbu/:sbuCode',
  '/state/:stateCode/dept/:deptCode',
  '/sbu/:sbuCode/dept/:deptCode',
  '/year/:year/state/:stateCode/sbu/:sbuCode',
  '/year/:year/state/:stateCode/dept/:deptCode',
  '/year/:year/sbu/:sbuCode/dept/:deptCode',
  '/state/:stateCode/sbu/:sbuCode/dept/:deptCode',
  '/year/:year/state/:stateCode/sbu/:sbuCode/dept/:deptCode',
];

export const pages = [
  {
    pageLink: '/',
    component: Dashboard,
    displayName: 'Sales',
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
    displayName: 'Stores',
    showInNavbar: true,
    navbarIcon: WarehouseDashboardIcon,
  },
  {
    pageLink: '/pricing',
    component: PricingDashboard,
    displayName: 'Sales Forecast',
    showInNavbar: true,
    navbarIcon: PricingDashboardIcon,
  },
  {
    pageLink: '/directory',
    component: PDFDirectory,
    displayName: 'Summary Reports',
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