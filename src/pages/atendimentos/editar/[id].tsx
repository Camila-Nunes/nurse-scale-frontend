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

interface RegistroProps{
  numeroAtendimento: string;
  paciente: string;
  dataInicial: string;
  dataFinal: string;
  statusAtendimento: string;
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
    numeroAtendimento: '',
    paciente: '',
    dataInicial: '',
    dataFinal: '',
    statusAtendimento: '',
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
        const valorPacienteId = response.data.result.pacienteId;
        console.log(response.data.result);
        console.log("PacienteId: " + valorPacienteId);
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
    api.put(`/api/Atendimentos/${id}`, registro)
    .then(() => {
        console.log("registro atualizado: " + registro);
        toast.success("Registro atualizado com sucesso.")
        router.push("/atendimentos/listarAtendimentos");
    })
    .catch((error) => {
        toast.error('Erro ao atualizar registro:', error);
    });
  };  

  async function handleCancel (){
      router.push(`/atendimentos/listarAtendimentos`);
  };

  const handlePacienteSelecionado = (id: string) => {
    setPacienteId(id);
    setRegistro((prevData: any) => ({
      ...prevData,
      pacienteId: id,
    }));

    console.log("PacienteNovo: " + id);
  };
  
  const handleEnfermeiroSelecionado = (id: string) => {
    setEnfermeiroId(id);
  }; 

  const handleSelectCliente = (selectedClienteId: string, nomeFantasia: string) => {
    setClienteId(selectedClienteId);
  };

  return (
    <Page titulo="Editar Atendimento">
      <form onSubmit={handleSubmit} className="container max-w-full">
        <Link href="/atendimentos/listarAtendimentos">
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
              <div className="sm:col-span-7">
                <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
                <div className="mt-2">
                  <BuscaPaciente valorInicial={registro.paciente} onPacienteSelecionado={handlePacienteSelecionado} />
                  <input
                    type="hidden"
                    name="paciente"
                    id="paciente"
                    value={pacienteId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="data" className="block text-sm font-medium leading-6 text-gray-900">Data Inicial</label>
                <div className="mt-2">
                <input
                    type="date"
                    name="dataInicial"
                    id="dataInicial"
                    defaultValue={moment(registro.dataInicial).format('YYYY-MM-DD')}
                    autoComplete="data-inicial"
                    disabled
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="data" className="block text-sm font-medium leading-6 text-gray-900">Data Final</label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="dataFinal"
                    id="dataFinal"
                    defaultValue={moment(registro.dataFinal).format('YYYY-MM-DD')}
                    autoComplete="data"
                    disabled
                    className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                <div className="mt-2">
                  <select
                    id="statusAtendimento"
                    name="statusAtendimento"
                    autoComplete="statusAtendimento"
                    defaultValue={registro.statusAtendimento}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="AGUARDANDO">AGUARDANDO</option>
                    <option value="INICIADO">INICIADO</option>
                    <option value="PAUSADO">PAUSADO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-7">
                <label htmlFor="local" className="block text-sm font-medium leading-6 text-gray-900">Local de Atendimento</label>
                  <div className="mt-2">
                  <input
                    type="text"
                    name="localAtendimento"
                    id="localAtendimento"
                    defaultValue={registro.localAtendimento}
                    onChange={handleInputChange}
                    autoComplete="localAtendimento"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div className="mt-2">
                  <select
                    id="estadoAtendimento"
                    name="estadoAtendimento"
                    autoComplete="estadoAtendimento"
                    defaultValue={registro.estadoAtendimento}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>SP</option>
                    <option>RJ</option>
                    <option>ES</option>
                  </select>
                </div>
              </div>

              <div className="col-span-10">
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
                <label htmlFor="empresa" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                <div className="mt-2">
                  <ComboBoxClientes onSelectCliente={handleSelectCliente} isEditMode={true} defaultValue={registro.nomeFantasia}/>
                </div>  
              </div>
              
              <div className="sm:col-span-7">
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
                    />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Valor Empresa</label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="valorEmpresa"
                    id="valorEmpresa"
                    defaultValue={registro.valorEmpresa}
                    onChange={handleInputChange}
                    autoComplete="valorEmpresa"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="valorProfissional" className="block text-sm font-medium leading-6 text-gray-900">Valor Profissional</label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="valorProfissional"
                    id="valorProfissional"
                    defaultValue={registro.valorProfissional}
                    onChange={handleInputChange}
                    autoComplete="valorProfissional"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-1 text-center">
                <label htmlFor="pago" className="block text-sm font-medium leading-6 text-gray-900">Pago?</label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="diaPago"
                    id="diaPago"
                    defaultChecked={registro.diaPago === "SIM" ? true : false}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:text-teal-600 justify-center"
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