import Page from "@/components/Page";
import { useState } from "react";
import InputMask from "react-input-mask";

export default function Orcamentos() {

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


    const calcularImposto = () => {
        const valorEmpresaFloat = parseFloat(valorEmpresa.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const imposto = valorEmpresaFloat * 0.1142;
        return imposto.toFixed(2); // Limitando para duas casas decimais
    };

    const calcularLucro = () => {
        const valorProfissionalFloat = parseFloat(valorProfissional.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const valorDescontadoImpostoFloat = parseFloat(valorDescontadoImposto.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const lucro = valorDescontadoImpostoFloat - valorProfissionalFloat;
        return lucro.toFixed(2); // Limitando para duas casas decimais
    };

    const calcularValorDescontadoImposto = () => {
        const valorEmpresaFloat = parseFloat(valorEmpresa.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const impostoFloat = parseFloat(valorImposto.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const valorDescontado = valorEmpresaFloat - impostoFloat;
        return valorDescontado.toFixed(2); // Limitando para duas casas decimais
    };

    const handleValorEmpresaChange = (e) => {
        setValorEmpresa(e.target.value);
        const impostoCalculado = calcularImposto();
        setValorImposto(impostoCalculado);
        const valorDescontadoImpostoCalculado = calcularValorDescontadoImposto();
        setValorDescontadoImposto(valorDescontadoImpostoCalculado);
    };

    const handleValorProfissionalChange = (e) => {
        setValorProfissional(e.target.value);
        const lucroCalculado = calcularLucro();
        setValorLucro(lucroCalculado);
        const porcentagemLucroCalculada = calcularPorcentagemLucro();
        setPorcentagemLucro(porcentagemLucroCalculada);
    };

    const calcularPorcentagemLucro = () => {
        const valorEmpresaFloat = parseFloat(valorEmpresa.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const valorLucroFloat = parseFloat(valorLucro.replace(',', '.')); // Substitua vírgula por ponto e converta para número de ponto flutuante
        const porcentagemLucro = (valorLucroFloat / valorEmpresaFloat) * 100;
        return porcentagemLucro.toFixed(2); // Limitando para duas casas decimais
    };

    const calcularTotalImposto = (totalEmpresaFloat: number): string => {
        const imposto: number = totalEmpresaFloat * 0.1142;
        return imposto.toFixed(2);
    };

    const calcularTotalEmpresa = (valor: number, dias: number): string => {
        const total = valor * dias;
        return total.toFixed(2);
    };

    const calcularValorTotalDescontadoImposto = (totalEmpresaFloat: number, totalImpostoFloat: number): string => {
        const valorDescontado = totalEmpresaFloat - totalImpostoFloat;
        return valorDescontado.toFixed(2);
    };

    const calcularTotalProfissional = (valor: number, dias: number): string => {
        const total = valor * dias;
        return total.toFixed(2);
    };

    const calcularTotalLucro = (valorDescontadoImpostoFloat: number, valorProfissionalFloat: number, dias: number): string => {
        const total = valorDescontadoImpostoFloat - valorProfissionalFloat;
        return total.toFixed(2);
    };

    const calcularTotalPorcentagemLucro = (valorTotalEmpresa: number, valorTotalLucro: number) => {
        const porcentagemLucroTotal = (valorTotalLucro / valorTotalEmpresa) * 100;
        return porcentagemLucroTotal.toFixed(2); // Limitando para duas casas decimais
    };

    const handleDiasAtendimentoChange = (e) => {
        setDiasAtendimento(e.target.value);
        const totalEmpresaCalculado = calcularTotalEmpresa(parseFloat(valorEmpresa), parseInt(e.target.value));
        setTotalEmpresa(totalEmpresaCalculado);
        
        const impostoCalculado: string = calcularTotalImposto(parseFloat(totalEmpresaCalculado));
        setTotalImposto(impostoCalculado);

        const valorTotalDescontadoImpostoCalculado = calcularValorTotalDescontadoImposto(parseFloat(totalEmpresaCalculado), parseFloat(impostoCalculado));
        setTotalDesconto(valorTotalDescontadoImpostoCalculado);

        const totalProfissionalCalculado = calcularTotalProfissional(parseFloat(valorProfissional), parseInt(e.target.value));
        setTotalProfissional(totalProfissionalCalculado);

        const totalLucroCalculado = calcularTotalLucro(parseFloat(valorTotalDescontadoImpostoCalculado), parseFloat(totalProfissionalCalculado), parseInt(e.target.value));
        setTotalLucro(totalLucroCalculado);

        const totalPorcentagemLucro = calcularTotalPorcentagemLucro(parseFloat(totalEmpresaCalculado), parseFloat(totalLucroCalculado));
        setTotalPercentualLucro(totalPorcentagemLucro);
    };

    return (
        <Page titulo="Orçamentos">
            <form className="container max-w-full">
                <div className="container mx-auto">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border text-white text-center pb-10">
                            <div className="sm:col-span-12 uppercase bg-teal-800 px-10">
                                <p className="py-5 uppercase">Valor Individual</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-com-desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Valor para Empresa</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask="999.99"
                                        maskChar=""
                                        type="text"
                                        name="valor-com-desconto"
                                        id="valor-com-desconto"
                                        value={valorEmpresa}
                                        onChange={handleValorEmpresaChange}
                                        autoComplete="valor-com-desconto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="aliquota" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Alíquota</label>
                                <div className="mt-2">
                                    <InputMask mask="99,99%" 
                                        type="text"
                                        name="aliquota"
                                        id="aliquota"
                                        value={11.42}
                                        autoComplete="aliquota"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Valor Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-imposto"
                                        id="valor-imposto"
                                        value={valorImposto}
                                        autoComplete="valor-imposto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-descontado-imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Valor Descontado Imposto (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-descontado-imposto"
                                        id="valor-descontado-imposto"
                                        value={valorDescontadoImposto}
                                        autoComplete="valor-descontado-imposto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-profissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Valor Profissional (R$)</label>
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
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-lucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Valor Lucro (R$)</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="valor-lucro"
                                        id="valor-lucro"
                                        value={valorLucro}
                                        autoComplete="valor-lucro"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="valor-lucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase">% Lucro</label>
                                <div className="mt-2">
                                    <InputMask mask="99,99%" 
                                        type="text"
                                        name="valor-lucro"
                                        id="valor-lucro"
                                        value={porcentagemLucro}
                                        onChange={handleValorProfissionalChange}
                                        autoComplete="valor-lucro"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>  

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border text-white text-center pb-10">
                            <div className="sm:col-span-12 uppercase bg-teal-800 px-10">
                                <p className="py-5 uppercase">Valores Totalizados</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diasAtendimento" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Dias de Atendimento</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="diasAtendimento"
                                        id="diasAtendimento"
                                        value={diasAtendimento}
                                        onChange={handleDiasAtendimentoChange}
                                        autoComplete="valor-com-desconto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-2">
                                <label htmlFor="totalEmpresa" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Total Empresa</label>
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
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-1">
                                <label htmlFor="imposto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Imposto</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="imposto"
                                        id="imposto"
                                        value={totalImposto}
                                        autoComplete="valor-com-desconto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Desconto</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name="desconto"
                                        id="desconto"
                                        value={totalDesconto}
                                        autoComplete="desconto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>  
                            <div className="sm:col-span-2">
                                <label htmlFor="totalProfissional" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Total Profissional</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask=""
                                        maskChar=""
                                        type="text"
                                        name=""
                                        id="totalProfissional"
                                        value={totalProfissional}
                                        autoComplete="totalProfissional"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div>   
                            <div className="sm:col-span-2">
                                <label htmlFor="totalLucro" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Total Lucro (R$)</label>
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
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled
                                    />
                                </div>
                            </div> 
                            <div className="sm:col-span-2">
                                <label htmlFor="valor-com-desconto" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Total % Lucro</label>
                                <div className="mt-2">
                                    <InputMask
                                        mask="99,99%" 
                                        maskChar=""
                                        type="text"
                                        name="valor-com-desconto"
                                        id="valor-com-desconto"
                                        value={totalPercentualLucro}
                                        autoComplete="valor-com-desconto"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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