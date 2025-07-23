import React, { createContext, useEffect } from "react";
import { IUsuario } from "../types";
import { obterUsuario, criaUsuario } from "../api";

interface AppContextType {
  usuario: IUsuario | null;
  criarUsuario: (usuario: Omit<IUsuario, "id">) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = React.useState<IUsuario | null>(null);
  const carregaDadosUsuario = async () => {
    try {
      const usuarios = await obterUsuario();
      if (usuarios.length > 0) setUsuario(usuarios[0]);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  useEffect(() => {
    carregaDadosUsuario();
  }, []);

  const criarUsuario = async (usuario: Omit<IUsuario, "id">) => {
    try {
      const novoUsuario = await criaUsuario(usuario);
      setUsuario(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  return (
    <AppContext.Provider value={{ usuario, criarUsuario }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
