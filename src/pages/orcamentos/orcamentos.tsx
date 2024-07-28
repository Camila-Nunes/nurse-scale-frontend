import Page from "@/components/Page";
import { useEffect, useState, useRef } from "react";
import InputMask from "react-input-mask";
import api from "@/api";
import { Slide, toast } from "react-toastify";
import classNames from 'classnames';

export default function Orcamentos() {

    const valorEmpresaRef = useRef<HTMLInputElement>(null);
    const [valorImpostoProfissional, setValorImpostoProfissional] = useState<number>(0);
    const [valorDescontadoImposto, setValorDescontadoImposto] = useState('0');
    const [valorProfissional, setValorProfissional] = useState<number>(0);
    const [porcentagemLucroProfissional, setPorcentagemLucroProfissional] = useState<number>(0);
    const [porcentagemLucroEmpresa, setPorcentagemLucroEmpresa] = useState<string>('');
    const [totalEmpresa, setTotalEmpresa] = useState('0');
    const [totalImposto, setTotalImposto] = useState('0');
    const [totalDesconto, setTotalDesconto] = useState('0');
    const [totalLucro, setTotalLucro] = useState('0');
    const [totalProfissional, setTotalProfissional] = useState('0');
    const [totalPercentualLucro, setTotalPercentualLucro] = useState('0');
    const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
    const [aliquotas, setAliquotas] = useState([]);
    const [valorAliquota, setValorAliquota] = useState<number>(0);
    const [valorSemImposto, setSemImposto] = useState<number>(0);
    const [valorLucro, setValorLucro] = useState<number>(0);
    const [diasAtendimento, setDiasAtendimento] = useState<number>(0);
    const [valorEmpresa, setValorEmpresa]  = useState<number>(0);
    const [valorSemImpostoEmpresa, setSemImpostoEmpresa] = useState<number>(0);
    const [valorImpostoEmpresa, setValorImpostoEmpresa] = useState<number>(0);
    const [isNegative, setIsNegative] = useState<boolean>(false);

    useEffect(() => {
        loadValorAliquota();
    });

    async function loadValorAliquota() {
        try {
          const response = await api.get(
            `/api/TabelaDinamica/buscar-aliquota`
          );
          setAliquotas(response.data);
        } catch (error) {
          toast.error("Erro ao carregar dados. " + error);
        } finally {
            //setIsLoadingAtendimentos(false);
        }
    }

    const handleValorChange = (event) => {
        if (event) {
          setValorAliquota(event);
        } else {
          console.error("event.target is undefined", event);
        }
    };

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        handleValorChange(selectedValue); 
    };

    const handleValorProfissionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValorProfissional(parseFloat(event.target.value));
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          const imposto = (valorProfissional * valorAliquota) / 100;
          const valorComImpostoDescontado = valorProfissional - imposto;
          const porcentagemLucroProfissional = (valorComImpostoDescontado * 100) / valorProfissional;
          setValorImpostoProfissional(imposto);
          setSemImposto(valorComImpostoDescontado);
          setPorcentagemLucroProfissional(porcentagemLucroProfissional);
        }
    };


    const handleValorEmpresaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValorEmpresa(parseFloat(event.target.value));
    };

    const handleKeyPressEmpresa = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          const impostoEmpresa = (valorEmpresa * valorAliquota) / 100;
          const valorComImpostoDescontadoEmpresa = valorEmpresa - impostoEmpresa;
          //const porcentagemLucroEmpresa = ((valorComImpostoDescontadoEmpresa - valorProfissional * 100) / valorEmpresa) - 100;

          const calcularPorcentagemLucro = () => {
            const porcentagem = ((valorComImpostoDescontadoEmpresa - valorProfissional) / valorEmpresa) * 100;
            return porcentagem;
          };
      
          const formatarPorcentagem = (valor: number) => {
            const isNegative = valor < 0;
            setIsNegative(isNegative);
            const formattedValue = valor.toFixed(2).replace('.', ',');
            return `${formattedValue}%`;
          };
      
          const porcentagem = calcularPorcentagemLucro();
          const formattedPorcentagem = formatarPorcentagem(porcentagem);
          
          setPorcentagemLucroEmpresa(formattedPorcentagem);

          setValorImpostoEmpresa(impostoEmpresa);
          setSemImpostoEmpresa(valorComImpostoDescontadoEmpresa);

        }
    };

    const formatAliquota = (valor: number) => {
        if (!valor) return '';
        const [intPart, decimalPart] = valor.toString().split('.');
        const formattedDecimal = decimalPart ? decimalPart.padEnd(2, '0').slice(0, 2) : '00';
        return `${intPart},${formattedDecimal}%`;
    };

    return (
        <Page titulo="Orçamentos">
            <form className="container max-w-full">
                <div className="container mx-auto">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="sm:col-span-3">
                            <label htmlFor="aliquota" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Alíquota</label>
                            <div className="mt-2">
                                <select
                                    name="aliquota"
                                    id="aliquota"
                                    value={valorAliquota}
                                    onChange={handleSelectChange}
                                    className="font-bold block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Selecione uma alíquota</option>
                                    {aliquotas.map((aliquota) => (
                                    <option key={aliquota.aliquotaId} value={aliquota.valorAliquota}>
                                        {formatAliquota(aliquota.valorAliquota)}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border text-white text-center pb-10 items-center">
                            <div className="sm:col-span-12 uppercase bg-teal-600 px-10">
                                <p className="py-5 uppercase">Valor para Profissional</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-profissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor Profissional (R$)</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask="999.99"
                                        maskChar=""
                                        type="text"
                                        name="valorProfissional"
                                        id="valorProfissional"
                                        value={valorProfissional}
                                        autoComplete="valor-profissional"
                                        onChange={handleValorProfissionalChange}
                                        onKeyPress={handleKeyPress}
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valorImpostoProfissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor do Imposto (R$)</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        id="valorImpostoProfissional"
                                        value={valorImpostoProfissional}
                                        autoComplete="off"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valorSemImposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor sem Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valorSemImposto"
                                        id="valorSemImposto"
                                        value={valorSemImposto}
                                        autoComplete="valorSemImposto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-lucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">% Lucro</label>
                                <div className="mt-2">
                                    <InputMask 
                                        mask="99,99%" 
                                        maskChar=""
                                        type="text"
                                        name="valor-lucro"
                                        id="valor-lucro"
                                        value={porcentagemLucroProfissional}
                                        autoComplete="valor-lucro"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>  
                        
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border text-white text-center pb-10">
                            <div className="sm:col-span-12 uppercase bg-teal-600 px-10">
                                <p className="py-5 uppercase">Valor para Empresa</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-profissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor Empresa (R$)</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask="999.99"
                                        maskChar=""
                                        type="text"
                                        name="valorEmpresa"
                                        id="valorEmpresa"
                                        value={valorEmpresa}
                                        onChange={handleValorEmpresaChange}
                                        onKeyPress={handleKeyPressEmpresa}
                                        autoComplete="valorEmpresa"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor do Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valorImpostoEmpresa"
                                        id="valorImpostoEmpresa"
                                        value={valorImpostoEmpresa}
                                        autoComplete="valorImpostoEmpresa"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-descontado-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor Sem Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-descontado-imposto"
                                        id="valor-descontado-imposto"
                                        value={valorSemImpostoEmpresa}
                                        autoComplete="valor-descontado-imposto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            
                            
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-lucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">% Lucro</label>
                                <div className="mt-2">
                                    <InputMask 
                                        mask="99,99%" 
                                        maskChar=""
                                        type="text"
                                        name="valor-lucro"
                                        id="valor-lucro"
                                        value={porcentagemLucroEmpresa}
                                        autoComplete="valor-lucro"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div> 


                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border text-white text-center pb-10">
                            <div className="sm:col-span-12 uppercase bg-teal-600 px-10">
                                <p className="py-5 uppercase">Valores Totalizados</p>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="diasAtendimento" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Atendimentos</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="diasAtendimento"
                                        id="diasAtendimento"
                                        value={diasAtendimento}
                                        autoComplete="valor-com-desconto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-2">
                                <label htmlFor="totalEmpresa" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Total Empresa</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="totalEmpresa"
                                        id="totalEmpresa"
                                        value={totalEmpresa}
                                        readOnly
                                        autoComplete="totalEmpresa"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-1">
                                <label htmlFor="imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Imposto</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="imposto"
                                        id="imposto"
                                        value={totalImposto}
                                        autoComplete="valor-com-desconto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Total Descontado Imposto</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="desconto"
                                        id="desconto"
                                        value={totalDesconto}
                                        autoComplete="desconto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>  
                            <div className="sm:col-span-2">
                                <label htmlFor="totalProfissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Total Profissional</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name=""
                                        id="totalProfissional"
                                        value={totalProfissional}
                                        autoComplete="totalProfissional"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>   
                            <div className="sm:col-span-2">
                                <label htmlFor="totalLucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Total Lucro (R$)</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="totalLucro"
                                        id="totalLucro"
                                        value={totalLucro}
                                        autoComplete="totalLucro"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-2">
                                <label htmlFor="total-porcentagem-lucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Total % Lucro</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask="99,99%" 
                                        maskChar=""
                                        type="text"
                                        name="total-porcentagem-lucro"
                                        id="total-porcentagem-lucro"
                                        value={totalPercentualLucro}
                                        autoComplete="total-porcentagem-lucro"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>        
                        </div>
                    </div>
                </div>
            </form>
        </Page>
    )
}