import Page from "@/components/Page";
import { useEffect, useState, useRef } from "react";
import InputMask from "react-input-mask";
import api from "@/api";
import { Slide, toast } from "react-toastify";

export default function Orcamentos() {

    const valorEmpresaRef = useRef<HTMLInputElement>(null);
    const [valorEmpresa, setValorEmpresa] = useState('0');
    const [valorImposto, setValorImposto] = useState('0');
    const [valorDescontadoImposto, setValorDescontadoImposto] = useState('0');
    const [valorProfissional, setValorProfissional] = useState('0');
    const [valorLucro, setValorLucro] = useState('0');
    const [porcentagemLucro, setPorcentagemLucro] = useState('0');
    const [diasAtendimento, setDiasAtendimento] = useState('0');
    const [totalEmpresa, setTotalEmpresa] = useState('0');
    const [totalImposto, setTotalImposto] = useState('0');
    const [totalDesconto, setTotalDesconto] = useState('0');
    const [totalLucro, setTotalLucro] = useState('0');
    const [totalProfissional, setTotalProfissional] = useState('0');
    const [totalPercentualLucro, setTotalPercentualLucro] = useState('0');
    const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
    const [aliquotas, setAliquotas] = useState([]);
    const [valorAliquota, setValorAliquota] = useState('');

    

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
        handleValorChange(selectedValue); // Atualize o valor da alíquota selecionada
        // Refaça os cálculos com base na alíquota escolhida aqui
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
                                        name="valor-profissional"
                                        id="valor-profissional"
                                        value={valorProfissional}
                                        onChange={handleValorProfissionalChange}
                                        autoComplete="valor-profissional"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onFocus={handleFocus}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-com-desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor do Imposto</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        id="valor-com-desconto"
                                        value={valorEmpresa}
                                        onChange={handleValorEmpresaChange}
                                        autoComplete="off"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onFocus={handleFocus}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor sem Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-imposto"
                                        id="valor-imposto"
                                        value={valorImposto}
                                        autoComplete="valor-imposto"
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
                                        value={porcentagemLucro}
                                        onChange={handleValorProfissionalChange}
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
                                <label htmlFor="valor-com-desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor para Empresa</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        id="valor-com-desconto"
                                        value={valorEmpresa}
                                        onChange={handleValorEmpresaChange}
                                        autoComplete="off"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onFocus={handleFocus}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-imposto"
                                        id="valor-imposto"
                                        value={valorImposto}
                                        autoComplete="valor-imposto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="valor-descontado-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase text-right">Valor Descontado Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-descontado-imposto"
                                        id="valor-descontado-imposto"
                                        value={valorDescontadoImposto}
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
                                        value={porcentagemLucro}
                                        onChange={handleValorProfissionalChange}
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
                                        onChange={handleDiasAtendimentoChange}
                                        autoComplete="valor-com-desconto"
                                        className="text-right block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onFocus={handleFocus}
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
                                        onChange={handleValorEmpresaChange}
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