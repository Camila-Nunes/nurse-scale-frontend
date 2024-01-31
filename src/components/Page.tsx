import Sidebar from './Sidebar'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
interface PageProps {
    titulo: string
    children: any
}

export default function Page(props: PageProps) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header 
                    titulo={props.titulo}
                    className="h-16 bg-zinc-800 text-slate-300"
                />
                <Content>{props.children}</Content>
                <Footer
                    textoEsquerda="💻 Desenvolvido por Camila Nunes"
                    textoDireita={`${new Date().getFullYear()}`}
                />
            </div>
        </div>
    )
}
