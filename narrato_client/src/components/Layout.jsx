import React from 'react';
import { NavbarWithSearch } from './Navbar';
import { FooterWithLogo } from './Footer';
import { Typography } from "@material-tailwind/react";

export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
   
      <NavbarWithSearch/>

      {/* Main Content Area - Scrollable with minimum height */}
      <main className="flex-grow overflow-y-auto min-h-[calc(100vh-200px)] bg-orange-50 p-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      
      <FooterWithLogo/>
     
    </div>
  );
}

export default Layout;