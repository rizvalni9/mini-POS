import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage(){
    return(
        <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
                <div className="mb-8">
                    <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-indigo 600 text-white">
                        <LogIn size={22}/>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950">Masuk MiniPOS</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Gunakan akun yang dibuat melalui Firebase Authentication</p>
                </div>
                <form className="grid gap-5">
                    <Input label="Email" type="email" placeholder="siswa@example.com"/>

                    <Input label="Password" type="password" placeholder="Minimal 6 karakter"/>

                    <Button type="submit">
                        Login
                    </Button>
                </form>
            </div>
        </main>
    )
}