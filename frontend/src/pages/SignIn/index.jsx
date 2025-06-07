import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import { LogIn, LockIcon, LoaderIcon } from "lucide-react"
import { ThemeSwitcher } from "../../components/ui/ThemeSwitcher"
import { useSignIn } from "./useSignIn"
import { User } from "lucide-react"



function SignIn() {
  const { SignIn, loadingAuth } = useContext(AuthContext);
  const { changePassword, errors, handleSubmit, watch, setValue, register } = useSignIn();

  return (
    <div className="w-screen h-screen justify-center items-center flex bg-slate-100 dark:bg-slate-600">
      <div className="absolute left-10 bottom-10">
        <ThemeSwitcher />
      </div>
      <Tabs defaultValue="account" className="w-[calc(100vw-135px)] sm:max-w-[425px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Login</TabsTrigger>
          <TabsTrigger value="password">Esqueci a senha</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <div className="items-center justify-center flex flex-col mt-4">
              <div className="dark:hidden">
                <img src="/images/logo.png" alt="Logo da loja" className="w-24" />
              </div>
              <div className="hidden dark:flex">
                <img src="/images/logo.png" alt="Logo da loja" className="w-24" />
              </div>
            </div>
            <form onSubmit={handleSubmit(SignIn)}>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Faça login e entre na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="user" className="flex-row flex">
                    <User className="w-4 h-4 mr-1" />
                    Usúario
                  </Label>
                  <Input type="text" {...register("user")} autoFocus />
                  {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name" className="flex-row flex">
                    <LockIcon className="w-4 h-4 mr-1" />
                    Senha
                  </Label>
                  <Input type="password" {...register("password")} />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="default" type="submit">
                  Logar
                  {loadingAuth ? <LoaderIcon className="w-4 h-4 ml-2 animate-spin" /> : <LogIn className="w-4 h-4 ml-2" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <form >
              <CardHeader>
                <CardTitle>Senha</CardTitle>
                <CardDescription>
                  Mude sua senha, caso tenha esquecido.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="user">user</Label>
                  <Input id="user" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="current">Senha atual</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Nova senha</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Salvar senha</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}

export default SignIn;