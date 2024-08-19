import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from "react";
import api from '../../../api';
import Link from "next/link";
import moment from 'moment';
import {Slide, Flip, toast } from 'react-toastify';
import BuscaEnfermeiro from "@/components/BuscaEnfermeiro";
import BuscaPaciente from "@/components/BuscaPaciente";
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import { CgSpinnerTwo } from "react-icons/cg";
import InputMask from "react-input-mask";

interface RegistroProps{
  atendimentoId: string;
  numeroAtendimento: string;
  paciente: string;
  dataAtendimento: string;
  horario: string;
  localAtendimento: string;
  estadoAtendimento: string;
  enfermeiro: string;
  nomeFantasia: string;
  assistencia: string;
  valorEmpresa: number;
  valorProfissional: number;
  diaPago: string;
}

export default function EditarAtendimento() {
  const router = useRouter();
  const { id } = router.query;
  const [registro, setRegistro] = useState<RegistroProps>({
    atendimentoId: '',
    numeroAtendimento: '',
    paciente: '',
    dataAtendimento: '',
    horario: '',
    localAtendimento: '',
    estadoAtendimento: '',
    enfermeiro: '',
    nomeFantasia: '',
    assistencia: '',
    valorEmpresa: 0, // ou o valor padrão desejado
    valorProfissional: 0, // ou o valor padrão desejado
    diaPago: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [clienteId, setClienteId] = useState<string>('');
  const [pacienteId, setPacienteId] = useState('');
  const [enfermeiroId, setEnfermeiroId] = useState('');

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const response = await api.get(`/api/Atendimentos/` + id); 
        setRegistro(response.data.result);
      } catch (error) {
        console.error('Erro ao obter os dados do registro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        fetchRegistro();
      }, 1000);
    }

  }, [id]);

  if (isLoading || !registro) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRegistro((prevData: any) => ({
      ...prevData,
      [name]: value,
      pacienteId: name === 'paciente' ? value : prevData.pacienteId,
      enfermeiroId: name === 'enfermeiro' ? value : prevData.enfermeiroId,
      clienteId: name === 'cliente' ? value : prevData.clienteId,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const payload = {
        id: id,
        enfermeiroId: enfermeiroId
    };

    api.put(`/api/Atendimentos/${id}`, null, {
        params: {
            enfermeiroId: enfermeiroId
        }
    })
    .then(() => {
        console.log("Registro atualizado com sucesso: " + id);
        toast.success("Registro atualizado com sucesso.");
        router.push("/atendimentos/listar-atendimentos");
    })
    .catch((error) => {
        toast.error('Erro ao atualizar registro: ' + error.message);
    });
  };

  async function handleCancel (){
      router.push(`/atendimentos/listar-atendimentos`);
  };

  const handleEnfermeiroSelecionado = (enfermeiroId: string) => {
    setEnfermeiroId(enfermeiroId);
  }; 

  return (
    <Page titulo="Editar Atendimento">
      <form onSubmit={handleSubmit} className="container max-w-full">
        <Link href="/atendimentos/listar-atendimentos">
            <button type="button" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>
        </Link>
        <div className="container mx-auto">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
            <div className="sm:col-span-1">
                <label htmlFor="atendimento" className="block text-sm font-medium leading-6 text-gray-900">Atendimento</label>
                <div className="mt-2">
                <input
                    type="text"
                    name="atendimento"
                    id="atendimento"
                    autoComplete="atendimento"
                    defaultValue={registro.numeroAtendimento}
                    onChange={handleInputChange}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />    
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="data" className="block text-sm font-medium leading-6 text-gray-900">Data Atendimento</label>
                <div className="mt-2">
                <input
                    type="date"
                    name="dataInicial"
                    id="dataInicial"
                    defaultValue={moment(registro.dataAtendimento).format('YYYY-MM-DD')}
                    autoComplete="data-inicial"
                    disabled
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="data" className="block text-sm font-medium leading-6 text-gray-900">Horário</label>
                <div className="mt-2">
                <input
                    type="text"
                    name="horario"
                    id="horario"
                    defaultValue={registro.horario}
                    autoComplete="horario"
                    disabled
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="data" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
                <div className="mt-2">
                <input
                    type="text"
                    name="paciente"
                    id="paciente"
                    defaultValue={registro.paciente}
                    autoComplete="paciente"
                    disabled
                    className="text-left block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="local" className="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                  <div className="mt-2">
                  <input
                    type="text"
                    name="localAtendimento"
                    id="localAtendimento"
                    defaultValue={registro.localAtendimento}
                    onChange={handleInputChange}
                    autoComplete="localAtendimento"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>
              
              <div className="col-span-4">
                <label htmlFor="profissional" className="block text-sm font-medium leading-6 text-gray-900">Profissional</label>
                <div className="mt-2">
                  <BuscaEnfermeiro valorInicial={registro.enfermeiro} onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
                  <input
                    type="hidden"
                    name="enfermeiro"
                    id="enfermeiro"
                    value={enfermeiroId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="local" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                  <div className="mt-2">
                  <input
                    type="text"
                    name="empresa"
                    id="empresa"
                    defaultValue={registro.nomeFantasia}
                    onChange={handleInputChange}
                    autoComplete="empresa"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="assistencia" className="block text-sm font-medium leading-6 text-gray-900">Assitência</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="assistencia"
                      id="assistencia"
                      defaultValue={registro.assistencia}
                      onChange={handleInputChange}
                      autoComplete="assistencia"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      disabled
                    />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Valor Empresa</label>
                <div className="mt-2">
                <InputMask
                    mask="R$ 999.99"
                    type="text"
                    name="valorEmpresa"
                    id="valorEmpresa"
                    defaultValue={registro.valorEmpresa}
                    onChange={handleInputChange}
                    autoComplete="valorEmpresa"
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="valorProfissional" className="block text-sm font-medium leading-6 text-gray-900">Valor Profissional</label>
                <div className="mt-2">
                  <InputMask
                    mask="R$ 999.99"
                    type="text"
                    name="valorProfissional"
                    id="valorProfissional"
                    defaultValue={registro.valorProfissional}
                    onChange={handleInputChange}
                    autoComplete="valorProfissional"
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div> 
          <div className="mt-6 flex items-center justify-end gap-x-2">
            <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
            <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 hover:bg-teal-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm">Salvar</button>
          </div>
          {/* <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" onClick={handleCancel} className="bg-red-900 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-cyan-900 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-4 rounded">Salvar</button>
          </div>  */}
        </div>
      </form>  
    </Page>
  );
};