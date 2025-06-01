import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sigin-up-form";

const AuthenticationPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <h1 className="text-white">
        {" "}
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </h1>
    </div>
  );
};

export default AuthenticationPage;
