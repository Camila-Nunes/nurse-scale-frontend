import api from "@/api";
import Page from "@/components/Page";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Slide, toast } from "react-toastify";

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const router = useRouter();

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFoto = e.target.files?.[0];

    if (selectedFoto) {
      setFoto(selectedFoto);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usuario = {
      nome,
      email,
      senha,
      confirmarSenha,
      tipoUsuario
      //,foto
    }

  try {
    const response = await api.post('/api/Usuarios/register', usuario);

    console.log(usuario);

    toast.success(`Usuário ${nome} salvo com sucesso.`, {
        transition: Slide,
        icon: true,
      });
      router.push("/usuarios/listar-usuarios");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar usuário: " + nome, {
        transition: Slide,
        icon: true,
      });
    }
  };

  async function handleCancel (){
    router.push(`/usuarios/listar-usuarios`);
  };

  return (
    <Page titulo="Cadastro de Usuários">
      <form onSubmit={handleSubmit} className="container max-w-full">
          <Link href="/usuarios/listar-usuarios">
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
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="senha" className="block text-sm font-medium leading-6 text-gray-900">Senha</label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="senha"
                          id="senha"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value.toUpperCase())}
                          autoComplete="senha"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium leading-6 text-gray-900">Confirmar Senha</label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="confirmarSenha"
                          id="confirmarSenha"
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value.toUpperCase())}
                          autoComplete="confirmarSenha"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:w-full">
                    <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">Tipo de Usuário</label>
                    <div className="mt-2">
                        <select
                          id="tipoUsuario"
                          name="tipoUsuario"
                          autoComplete="tipoUsuario"
                          value={tipoUsuario}
                          onChange={(e) => setTipoUsuario(e.target.value)}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option>Selecione o Tipo Usuário</option>
                            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                            <option value="FINANCEIRO">FINANCEIRO</option>
                            <option value="NORMAL">NORMAL</option>
                        </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="foto" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Escolher Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      name="foto"
                      id="foto"
                      onChange={handleFotoChange}
                      className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                    />
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