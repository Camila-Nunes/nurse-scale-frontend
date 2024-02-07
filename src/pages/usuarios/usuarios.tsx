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