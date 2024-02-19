import Page from "@/components/Page";

export default function TabelaDinamica() {
    return (
        <Page titulo="Tabela Dinâmica">
            <form className="container max-w-full">
                <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
                    <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-12">
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full rounded-md">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Total Empresa</th>
                                            </tr>
                                        </thead> 
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">PLENO</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 50.000,00</td>
                                            </tr>
                                        </tbody>  
                                    </table>             
                                </div>
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Total Profissional</th>
                                            </tr>
                                        </thead> 
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">PLENO</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 25.000,00</td>
                                            </tr>
                                        </tbody>  
                                    </table>             
                                </div>
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Bruto</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Liquido</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Imposto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        <tr className="border-b border-gray-200">
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 25.000,00</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 20.000,00</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 5.000,00</td>
                                            </tr>
                                        </tbody>
                                    </table>             
                                </div>
                                <div className="sm:col-span-12 px-5 mt-10">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Procedimentos</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Tipo de Atendimento</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Soma Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">PLENO</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Total: 26</td>
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Assistência A</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 10.000,00</td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"></td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"></td>
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Assistência B</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 15.000,00</td>
                                            </tr>
                                            
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Empresa2</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Total: 15</td>
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Assistência A</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 8.000,00</td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"></td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"></td>
                                                <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">Assistência B</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 7.000,00</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div> 
            </form>
        </Page>
    )
}