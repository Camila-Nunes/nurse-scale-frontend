import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import Link from "next/link";
import InputMask from "react-input-mask";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouter } from 'next/router';

import { 
  IconTrashX, 
  IconEdit,
  IconFilter
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";

export default function Clientes() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes]=useState([]);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    // Simulando um atraso de 2 segundos para carregar os dados
    setTimeout(() => {
      getClientes();
    }, 2000);
  }, []);

  async function getClientes() {
    try {
      const response = await api.get('/api/Clientes');
      setClientes(response.data.data.result);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idCliente: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Clientes/${idCliente}`);
      toast.success("Registro deletado com sucesso.");
      await getClientes();
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  }

  const handleNovoClienteClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/clientes/clientes');
    }, 2000);
  };

  return (
    <Page titulo="Listagem de Empresas">
      <form className="container max-w-full">
        <Link href="">
          <button onClick={handleNovoClienteClick} className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Cliente</button>    
        </Link>
        <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full">
              <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                <tr>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left">Nome</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left">CNPJ</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left">Email</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left">Telefone</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left">Cidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes && clientes.map((cliente: any)=>(
                    <tr key={cliente.clienteId}>
                      <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap">{cliente.nomeFantasia}</td>
                      <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap">
                        <InputMask mask="99.999.999/9999-99" value={cliente.cnpj} readOnly />
                      </td>
                      <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap">{cliente.emailPrincipal}</td>
                      <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap">
                        <InputMask mask="(99) 9 9999-9999" value={cliente.telefonePrincipal} readOnly />
                      </td>
                      <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap">{cliente.cidade} - {cliente.estado}</td>
                      <td className="text-center w-48 pb-3 pr-3">
                        <Link href={`/clientes/editar/${cliente.clienteId}`}>
                          <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                        </Link> { }
                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded" onClick={(event) => handleDeleteClick(event, cliente.clienteId)}><FaTrashAlt /></button>
                    </td> 
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </Page>
  )
}