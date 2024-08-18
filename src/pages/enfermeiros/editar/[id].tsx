import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../api';
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import Link from "next/link";
import { CgSpinnerTwo } from "react-icons/cg";
import EstadoSelect from "@/components/EstadoSelect";
import CidadeSelect from "@/components/CidadeSelect";

export default function EditarEnfermeiro() {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [registro, setRegistro] = useState<any>(null); // Defina o tipo adequado para o seu registro
    
    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                const response = await api.get(`/api/Enfermeiros/` + id); 
                setRegistro(response.data.result);
            } catch (error) {
            console.error('Erro ao obter os dados do registro:', error);
            }finally {
                setIsLoading(false);
            }};

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
        api.put(`/api/Enfermeiros/${id}`, registro)
        .then(() => {
            console.log(registro);
            toast.success("Registro atualizado com sucesso.")
            router.push("/enfermeiros/listar-enfermeiros");
        })
        .catch((error) => {
            toast.error('Erro ao atualizar registro:', error);
        });
    };  

    async function handleCancel (){
        router.push(`/enfermeiros/listar-enfermeiros`);
    };

    if (!registro) {
        return <div>Carregando...</div>;
    }

  return (
    <Page titulo="Editar Profissional">
      <form onSubmit={handleSubmit} className="container max-w-full">
        <Link href="/enfermeiros/listar-enfermeiros">
            <button type="button" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>
        </Link>
        <div className="container mx-auto">
            <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                        <label htmlFor="nome" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                defaultValue={registro.nome}
                                onChange={handleInputChange}
                                autoComplete="nome"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="cofen" className="block text-sm font-medium leading-6 text-gray-900">Nº COFEN</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="cofen"
                                id="cofen"
                                defaultValue={registro.cofen}
                                onChange={handleInputChange}
                                autoComplete="cofen"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                        <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-gray-900">CPF</label>
                        <div className="mt-2">
                            <InputMask mask="999.999.999-99" 
                                type="text"
                                name="cpf"
                                id="cpf"
                                defaultValue={registro.cpf}
                                onChange={handleInputChange}
                                autoComplete="cpf"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="rg" className="block text-sm font-medium leading-6 text-gray-900">RG</label>
                        <div className="mt-2">
                            <InputMask mask="99.999.999-9"
                                type="text"
                                name="rg"
                                id="rg"
                                defaultValue={registro.rg}
                                onChange={handleInputChange}
                                autoComplete="rg"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <EstadoSelect onSelect={registro.estado}/>
                    </div>
                    <div className="sm:col-span-3">
                        <CidadeSelect estado={registro.estado} onSelect={registro.cidade}/>
                    </div>
                    <div className="col-span-5">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <div className="mt-2">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={registro.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="telefone" className="block text-sm font-medium leading-6 text-gray-900">Telefone(Whatsapp)</label>
                        <div className="mt-2">
                            <InputMask mask="(99) 9 9999-9999"
                                id="telefone"
                                name="telefone"
                                type="telefone"
                                defaultValue={registro.telefone}
                                onChange={handleInputChange}
                                autoComplete="telefone"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-full">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Dados para pagamento</h2>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Tipo Chave Pix</label>
                        <div className="mt-2">
                            <select
                            id="tipoChavePix"
                            name="tipoChavePix"
                            defaultValue={registro.tipoChavePix}
                            //onChange={handleInputChange}
                            autoComplete="tipoChavePix"
                            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value="Selecione um tipo de Chave">Selecione uma tipo de Chave</option>
                                <option value="CPF">CPF</option>
                                <option value="Email">Email</option>
                                <option value="Telefone">Telefone</option>
                                <option value="ChaveAleatoria">Chave Aleatória</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="sm:col-span-4">
                        <label htmlFor="chave-pix" className="block text-sm font-medium leading-6 text-gray-900">Chave PIX</label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="chavePix"
                            id="chavePix"
                            defaultValue={registro.chavePix}
                            onChange={handleInputChange}
                            autoComplete="chavePix"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Banco</label>
                        <div className="mt-2">
                            <select
                                id="banco"
                                name="banco"
                                defaultValue={registro.banco}
                                //onChange={handleInputChange}
                                autoComplete="banco"
                                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value="Selecione um Banco">Selecione um Banco</option>
                                <option value="Bradesco">Bradesco</option>
                                <option value="Itau">Itaú</option>
                                <option value="Santander">Santander</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="agencia" className="block text-sm font-medium leading-6 text-gray-900">Agência</label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="agencia"
                            id="agencia"
                            defaultValue={registro.agencia}
                            onChange={handleInputChange}
                            autoComplete="agencia"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="conta" className="block text-sm font-medium leading-6 text-gray-900">Conta</label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="conta"
                            id="conta"
                            defaultValue={registro.conta}
                            onChange={handleInputChange}
                            autoComplete="conta"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
            </div>    
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm">Salvar</button>
            </div>  
        </div>
      </form>  
    </Page>
  );
};