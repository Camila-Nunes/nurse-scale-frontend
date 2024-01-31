import { Zoom, Flip, Bounce, Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css'

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App(props: any) {
    const { Component, pageProps } = props
    const router = useRouter();
      
    return (
        <>
            <Component {...pageProps} />
            <ToastContainer position="top-right"
                autoClose={2500}
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}
