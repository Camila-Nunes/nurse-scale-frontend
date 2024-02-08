import api from "@/api";
import Page from "@/components/Page";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Slide, toast } from "react-toastify";

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const router = useRouter();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usuario = {
      nome,
      email,
      senha,
      confirmarSenha,
      tipoUsuario
    }

  try {
    const response = await api.post('/api/Usuarios/registrar', usuario);
    toast.success(`Usuário ${usuario.nome}  salvo com sucesso.`, {
      transition: Slide,
      icon: false
    });
    router.push("/clientes/listarClientes");
  } catch (error) {
    console.error(error);
    toast.error("Erro ao salvar usuário: " + usuario.nome, {
      transition: Slide,
      icon: false
    });
  }};

  async function handleCancel (){
    router.push(`/clientes/listarClientes`);
  };

  return (
    <Page titulo="Cadastro de Usuários">
      <form onSubmit={handleSubmit} className="container max-w-full">
          <Link href="/clientes/listarClientes">
              <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>     
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
                          value={nome}
                          onChange={(e) => setNome(e.target.value.toUpperCase())}
                          autoComplete="nome"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>    
                
                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="nome"
                          id="nome"
                          value={nome}
                          onChange={(e) => setEmail(e.target.value.toUpperCase())}
                          autoComplete="nome"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>   

                  <div>
                    
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Senha</label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="nome"
                          id="nome"
                          value={nome}
                          onChange={(e) => setEmail(e.target.value.toUpperCase())}
                          autoComplete="nome"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Confirma Senha</label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="nome"
                          id="nome"
                          value={nome}
                          onChange={(e) => setEmail(e.target.value.toUpperCase())}
                          autoComplete="nome"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 sm:w-full">
                    <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">Tipo de Usuário</label>
                    <div className="mt-2">
                        <select
                          id="statusAtendimento"
                          name="statusAtendimento"
                          autoComplete="statusAtendimento"
                          value={tipoUsuario}
                          onChange={(e) => setTipoUsuario(e.target.value)}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option>Selecione o Tipo Usuário</option>
                            <option value="AGUARDANDO">NORMAL</option>
                            <option value="INICIADO">Administrador</option>
                            <option value="PAUSADO">FINANCEIRO</option>
                        </select>
                    </div>
                  </div>
                    
                </div>
            </div> 
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" onClick={handleCancel} className="bg-transparent hover:bg-red-700 text-red-700 text-sm font-semibold py-2 px-4 rounded-md hover:text-white border border-red-700 hover:border-transparent">Cancelar</button>
                <button type="submit" className="rounded-md bg-teal-600 hover:bg-teal-800 px-8 py-2 text-sm font-semibold leading-6 text-white">Salvar</button>
            </div>     
          </div>
      </form>      
    </Page>
  )
}