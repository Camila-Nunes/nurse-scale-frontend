import api from "@/api";
import Page from "@/components/Page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";

export default function ListaUsuarios() {
    const [isLoading, setIsLoading] = useState(true);
    const [usuarios, setUsuarios]=useState([]);

    const router = useRouter();

    useEffect(()=>{
        setTimeout(() => {
            getUsuarios()
        }, 2000);
      }, []);

    const handleNovoUsuarioClick = () => {
        setIsLoading(true);
        router.push('/usuarios/usuarios'); // ou qualquer rota que corresponda à página de cadastro
      };

    async function getUsuarios(){
        try {
          const response = await api.get(`/api/Usuarios`)
          setUsuarios(response.data.result);
        } catch (error) {
          toast.error("Erro ao carregar dados. " + error);
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <Page titulo="Listagem de Usuários">
            <form className="container max-w-full">
                <Link href="">
                    <button onClick={handleNovoUsuarioClick} className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white" disabled={isLoading}>
                        {isLoading ? (
                        <CgSpinnerTwo className="animate-spin text-white" size={20} />
                        ) : (
                        'Novo Usuário'
                        )}
                    </button>    
                </Link>
        
                <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
                    <div className="mt-6 overflow-y-auto rounded-lg shadow hidden md:block">
                        <table className="w-full">
                            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Nome</th>
                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Email</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usuarios && usuarios.map((usuario: any)=>(
                                <tr key={usuario.usuarioId}>
                                    <td className="text-left w-80 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{usuario.nome}</td>
                                    <td className="text-left w-80 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{usuario.email}</td>
                                    <td className="text-center w-40 pb-3 pr-3 border-r border-b border-gray-200">
                                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><FaTrashAlt /></button>
                                    </td> 
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* <Pagination
                            currentPage={currentPage}
                            totalPages={totalPaginas}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                            onPageChange={handlePageChange}
                        /> */}
                    </div>
                </div>
            </form>
        </Page>
    )
}