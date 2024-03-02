import Navbar from '@/src/Navbar/Navbar';
import React from 'react';

type layoutProps = {
    children?: React.ReactNode;
};

const Layout:React.FC<layoutProps> = ({ children }) => {
    
    return (
        <>
        {<Navbar />}
        <main>{children}</main>
        </>
    );
}
export default Layout;