import { ToastContainer } from 'react-toastify'
import '../app/globals.css'


export default function App(props: any) {
    const { Component, pageProps } = props
    
    return (
        <>
            <Component {...pageProps} />
            <ToastContainer position="top-right"
                autoClose={3000}
                limit={1}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="colored"
            />
        </>
    )
}
