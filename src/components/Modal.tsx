// components/Modal.tsx
import { useEffect, useState } from 'react';
import BuscaEnfermeiro from "@/components/BuscaEnfermeiro";
import { useRouter } from 'next/router';
import api from '@/api';
import { Slide, toast } from 'react-toastify';
import ModalAlert from './ModalAlert';
import numeral from 'numeral';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  atualizarAdiantamentos: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, atualizarAdiantamentos }) => {
  const [enfermeiroId, setEnfermeiroId] = useState('');
  const [dataLancamento, setDataLancamento] = useState<string>('');
  const [valorAdiantamento, setValorAdiantamento] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [somaAdiantamentos, setSomaAdiantamentos] = useState([]);
  const [valorDif, setValorDif] = useState('');
  const [modalAlertOpen, setModalAlertOpen] = useState(false);
  
  const router = useRouter();
  const dataAtual = new Date().toISOString().split('T')[0];

  const limparDados = () => {
    setEnfermeiroId('');
    setDataLancamento('');
    setValorAdiantamento('');
    setIsFormValid(false);
  };

  useEffect(() => {
    if (!isOpen) {
      limparDados();
    }
  }, [isOpen]);

  useEffect(() => {
    const isValid = !!enfermeiroId && !!dataLancamento && !!valorAdiantamento;
    setIsFormValid(isValid);
  }, [enfermeiroId, dataLancamento, valorAdiantamento]);
  
  if (!isOpen) return null;

  async function getSomaAdiantamentos(enfermeiroId: string) {
    try {
      const response = await api.get('/api/AdiantamentosPagamentos/adiantamentos-somados-por-enfermeiroid', {
        params: {
          enfermeiroId: enfermeiroId,
        },
      });
  
      const { data } = response;
      const somaAdiantamentos = data[0];
  
      setValorDif(somaAdiantamentos.valorDiferenca);
      return somaAdiantamentos.valorDiferenca;

    } catch (error) {
      toast.error('Erro ao carregar dados.');
      throw error;
    }
  }

  const handleSave = async () => {
    const adiantamento = {
      enfermeiroId,
      dataLancamento,
      valorAdiantamento,
    };
  
    try {
      const valorDiferenca = await getSomaAdiantamentos(adiantamento.enfermeiroId);
      const intValorAdiantamento = parseInt(valorAdiantamento);
      const intValorDiferenca = parseInt(valorDiferenca);

      if (intValorDiferenca === 0) {
        setModalAlertOpen(true);
        setValorDif('0');
        return;
      }
  
      if (intValorAdiantamento > intValorDiferenca) {
        setModalAlertOpen(true);
        return;
      }

      const response = await api.post('/api/AdiantamentosPagamentos', adiantamento);
      toast.success(`Registro salvo com sucesso.`, {
        transition: Slide,
        icon: true,
      });
  
      router.push('/adiantamentos/listarAdiantamentos');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar o registro', {
        transition: Slide,
        icon: true,
      });
    }
  
    onClose();
  };
  
  const handleEnfermeiroSelecionado = (id: string) => {
    setEnfermeiroId(id);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-4 rounded" onClick={handleModalClick}>
      <h2 className="text-sm font-semibold tracking-wide ext-left mb-4">Dados de Adiantamento:</h2>
        <div className="container mx-auto">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-2">
                <label htmlFor="dataLancamento" className="block text-sm font-medium leading-6 text-gray-900">Data Lançamento</label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="dataLancamento"
                    id="dataLancamento"
                    value={dataLancamento}
                    onChange={(e) => setDataLancamento(e.target.value)}
                    autoComplete="dataLancamento"
                    max={dataAtual}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>  
              <div className="col-span-8">
                <label htmlFor="profissional" className="block text-sm font-medium leading-6 text-gray-900">Profissional</label>
                <div className="mt-2">
                    <BuscaEnfermeiro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
                </div>
              </div>           
              <div className="sm:col-span-2">
                <label htmlFor="valorAdiantamento" className="block text-sm font-medium leading-6 text-gray-900">Valor</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="valorAdiantamento"
                    id="valorAdiantamento"
                    value={valorAdiantamento}
                    onChange={(e) => setValorAdiantamento(e.target.value)}
                    autoComplete="valorAdiantamento"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>  
        <div className="mt-6 flex items-center justify-end gap-x-2">
          <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
          <button type="button" onClick={handleSave} className={`text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 hover:bg-teal-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isFormValid}>Salvar</button>
          <ModalAlert 
            isOpenModalAlert={modalAlertOpen} 
            onClose={() => setModalAlertOpen(false)} 
            message={valorDif === '0' ? 'Esse registro está com o valor de diferença a ZERO. Não há mais valor para lançamento.' : `Esse registro tem somente ${numeral(valorDif).format('$0,0.00')} para ser lançado. Você deve lançar um valor menor ou igual a ${numeral(valorDif).format('$0,0.00')}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
