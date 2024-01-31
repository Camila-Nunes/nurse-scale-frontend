import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import Link from "next/link";
import InputMask from "react-input-mask";

import { 
  IconTrashX, 
  IconEdit,
  IconFilter
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";

export default function Clientes() {

  const [clientes, setClientes]=useState([]);
  const [deletando, setDeletando] = useState(false);

  useEffect(()=>{
    getClientes()
  }, [])

  async function getClientes(){
    const response = await api.get('/api/Clientes')
    .then(response => {
      setClientes(response.data.result);
    }).catch(error => {
       toast.error("Erro ao carregar dados. " + error)
    })
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idCliente: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Clientes/${idCliente}`);
      toast.success("Registro deletado com sucesso.");
      // if (response.status === 200) {
      //   setClientes(prevClientes => prevClientes.filter(c => c.clienteId !== idCliente));
      //   toast.success("Registro deletado com sucesso.");
      // } else {
      //   toast.error("Erro ao deletar registro.");
      // }
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };

  return (
    <Page titulo="Listagem de Clientes">
      <form className="container max-w-full">
        <Link href="/clientes/clientes">
          <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Cliente</button>     
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