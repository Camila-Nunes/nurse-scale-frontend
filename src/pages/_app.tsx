import '../app/globals.css'
import { useRouter } from 'next/router';
import { PrimeReactProvider } from 'primereact/api';

export default function App(props: any) {
    const { Component, pageProps } = props
    
    return (
        <>
            <PrimeReactProvider>
                <Component {...pageProps} />      
            </PrimeReactProvider>
        </>
    )
}
