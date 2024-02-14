import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../api';
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import Link from "next/link";
import { CgSpinnerTwo } from "react-icons/cg";
import EstadoEditadoSelect from "@/components/EstadoEditadoSelect";
import CidadeEditadaSelect from "@/components/CidadeEditadaSelect";

export default function EditarCliente() {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [registro, setRegistro] = useState<any>(null); // Defina o tipo adequado para o seu registro
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState<string>(''); // Defina o tipo adequado para a sua cidade
    
    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                const response = await api.get(`/api/Clientes/` + id); 
                setRegistro(response.data.data.result);
                setCidade(response.data.data.result.cidade);
            } catch (error) {
            console.error('Erro ao obter os dados do registro:', error);
            }finally {
            setIsLoading(false);
          }
        };

        if (id) {
            setIsLoading(true);
            setTimeout(() => {
                fetchRegistro();
            }, 1000);
        }

        }, [id]
    );

    if (isLoading || !registro) {
        return (
          <div className="flex justify-center items-center h-screen">
            <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
          </div>
        );
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } : any = event.target;
        setRegistro((prevData: any) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        api.put(`/api/Clientes/${id}`, registro)
        .then(() => {
            console.log(registro);
            toast.success("Registro atualizado com sucesso.")
            router.push("/clientes/listarClientes");
        })
        .catch((error) => {
            toast.error('Erro ao atualizar registro:', error);
        });
    };  

    async function handleCancel (){
        router.push(`/clientes/listarClientes`);
    };

    if (!registro) {
        return <div>Carregando...</div>;
    }
    
  return (
    <Page titulo="Editar Cliente">
        <form onSubmit={handleSubmit} className="container max-w-full">
            <Link href="/clientes/listarClientes">
                <button type="button" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>     
            </Link>    
            <div className="container mx-auto">
                <h6 className="text-sm font-semibold">Código do Cliente: {registro.clienteId}</h6>
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                        <div className="sm:col-span-4">
                            <label htmlFor="razao-social" className="block text-sm font-medium leading-6 text-gray-900">Razão Social</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="razao-social"
                                    id="razao-social"
                                    defaultValue={registro.razaoSocial}
                                    onChange={handleInputChange}
                                    autoComplete="razao-social"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="nome-empresa" className="block text-sm font-medium leading-6 text-gray-900">Nome Empresa</label>
                                <div className="mt-2">
                                <input
                                    type="text"
                                    name="nome-empresa"
                                    id="nome-empresa"
                                    defaultValue={registro.nomeFantasia}
                                    onChange={handleInputChange}
                                    autoComplete="nome-empresa"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="cnpj" className="block text-sm font-medium leading-6 text-gray-900">CNPJ</label>
                            <div className="mt-2">
                                <InputMask mask="99.999.999/9999-99" 
                                    type="text"
                                    name="cnpj"
                                    id="cnpj"
                                    defaultValue={registro.cnpj}
                                    onChange={handleInputChange}
                                    autoComplete="cnpj"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="inscricaoEstadual" className="block text-sm font-medium leading-6 text-gray-900">Inscrição Estadual</label>
                                <div className="mt-2">
                                <InputMask mask="999.999.999.999"
                                    type="text"
                                    name="inscricaoEstadual"
                                    id="inscricaoEstadual"
                                    defaultValue={registro.inscricaoEstadual}
                                    onChange={handleInputChange}
                                    autoComplete="inscricao-estadual"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <EstadoEditadoSelect onSelect={(estado) => setEstado(estado)} estadoInicial={registro.estado} />
                        </div>
                        <div className="sm:col-span-3">
                            <CidadeEditadaSelect estado={registro.estado} onSelect={(cidade) => setCidade(cidade)} cidadeInicial={cidade} />
                        </div>

                        <div className="col-span-5">
                            <label htmlFor="emailPrincipal" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            <div className="mt-2">
                                <input
                                id="emailPrincipal"
                                name="emailPrincipal"
                                type="email"
                                defaultValue={registro.emailPrincipal}
                                onChange={handleInputChange}
                                autoComplete="emailPrincipal"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="telefonePrincipal" className="block text-sm font-medium leading-6 text-gray-900">Telefone(Whatsapp)</label>
                            <div className="mt-2">
                                <InputMask mask="(99) 9 9999-9999"
                                    id="telefonePrincipal"
                                    name="telefonePrincipal"
                                    type="telefone"
                                    defaultValue={registro.telefonePrincipal}
                                    onChange={handleInputChange}
                                    autoComplete="telefonePrincipal"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>  
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" onClick={handleCancel} className="bg-red-900 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded">Cancelar</button>
                    <button type="submit" className="bg-cyan-900 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-4 rounded">Salvar</button>
                </div>  
            </div>
        </form>    
    </Page>
  );
};