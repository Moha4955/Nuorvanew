import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  headerVariant?: 'default' | 'minimal';
  footerVariant?: 'default' | 'minimal';
  showNavigation?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  headerVariant = 'default',
  footerVariant = 'default',
  showNavigation = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant={headerVariant} showNavigation={showNavigation} />
      <main className="flex-1">
        {children}
      </main>
      <Footer variant={footerVariant} />
    </div>
  );
};

export default PublicLayout;