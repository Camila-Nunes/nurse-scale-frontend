
import Logo from "./Logo";
import Menu from "./Menu";

export default function Sidebar() {
    
    const handleLogout = () => {    
       
    };

    return (
        <div className="flex flex-col gap-5 bg-zinc-800 h-screen">
            <Logo />
            <Menu />
        </div>
    )
}