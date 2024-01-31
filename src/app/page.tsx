import Page from "@/components/Page";
import { IconNurse } from "@tabler/icons-react";

export default function Home() {


  return (
    <Page titulo="Olá, Bem-vindo(a)">
      <div className={`
        flex flex-col justify-center items-center
        w-full h-full text-zinc-500
      `}>
        <IconNurse size={200} stroke={1} />
        <span className="font-black ">Nurses Scale</span>
        <span className="text-sm">O seu sistema de gerenciamento financeiro e escalas</span>
        <span className="text-sm pt-48">Versão 1.0.0</span>
      </div>
    </Page>
  )
}
