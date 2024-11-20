import React from 'react';
import { NavbarWithSearch } from './Navbar';
import { FooterWithLogo } from './Footer';
import { Typography } from "@material-tailwind/react";

export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed at top */}
      {/* <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap items-center justify-between text-blue-gray-900">
     
        </div>
      </Navbar> */}
      <NavbarWithSearch/>

      {/* Main Content Area - Scrollable with minimum height */}
      <main className="flex-grow overflow-y-auto min-h-[calc(100vh-200px)] bg-orange-50 p-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <FooterWithLogo/>
      {/* <footer className="w-full bg-ocean_green p-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
        
        </div>
      </footer> */}
    </div>
  );
}

export default Layout;