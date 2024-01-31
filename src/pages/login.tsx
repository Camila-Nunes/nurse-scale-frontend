import PageClean from "@/components/PageClean";
import api from "@/api";
import { useState } from 'react';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const login = {
      email,
      senha
    }

    try {
      const response = await api.post('/api/Usuarios/login', login);
      console.log(response.data);
      toast.success("Usuário logado com sucesso.");
      ///const { token } = response.data;
      //localStorage.setItem('jwt-Token', token);
      router.push('/');
    } catch (error) {
      toast.error("Erro ao efetuar o login. Verifique usuário e senha.");
    }
  };

  return (
    <PageClean  titulo="Login">
      <form onSubmit={handleLogin} className="max-w-lg mx-auto">
        <div className="border-2 border-teal-700 space-y-12 py-10 px-24 rounded-2xl mt-20">
          <div className=" pb-12">
          <p className="text-center">Faça seu Login</p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-12">
                <label htmlFor="email" className="block text-xl font-lg leading-6 text-black-300">Email</label>
                <div className="mt-2">
                  <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
              </div>
              <div className="sm:col-span-12">
                <label htmlFor="senha" className="block text-xl font-lg leading-6 text-black-300">Senha</label>
                <div className="mt-2">
                  <input
                        type="password"
                        name="senha"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoComplete="senha"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols gap-3">
              <button type="submit" className="rounded-md bg-teal-900 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Entrar</button>  
              <button type="button" className="rounded-md bg-red-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </PageClean>
  )
}