import { IconNurse } from '@tabler/icons-react'
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href="/" className="flex items-center px-5 gap-2.5 font-semibold h-16 bg-teal-600 text-zinc-100">
            <span className="text-zinc-100">
                <IconNurse size={40} stroke={2} />
            </span>
            <span className="text-xl">Nurses Scale</span>
        </Link>
    )
}