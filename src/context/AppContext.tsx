/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from "react";
import { ITransacoes, IUsuario } from "../types";
import {
  obterUsuario,
  criarUsuario,
  obterTransacoes,
  criarTransacao,
} from "../api";

interface AppContextType {
  usuario: IUsuario | null;
  criaUsuario: (usuario: Omit<IUsuario, "id">) => Promise<void>;
  transacoes: ITransacoes[];
  criaTransacao: (novaTransacao: Omit<ITransacoes, "id">) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = React.useState<IUsuario | null>(null);
  const [transacoes, setTrasacoes] = React.useState<ITransacoes[]>([]);

  const carregaDadosUsuario = async () => {
    try {
      const usuarios = await obterUsuario();
      const transacoes = await obterTransacoes();

      if (usuarios.length > 0) {
        setUsuario(usuarios[0]);
        setTrasacoes(transacoes);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  useEffect(() => {
    carregaDadosUsuario();
  });

  const criaUsuario = async (usuario: Omit<IUsuario, "id">) => {
    try {
      const novoUsuario = await criarUsuario(usuario);
      setUsuario(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const criaTransacao = async (novaTransacao: Omit<ITransacoes, "id">) => {
    try {
      const transacaoCriada = await criarTransacao(novaTransacao);
      setTrasacoes((prev) => [...prev, transacaoCriada]);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{ usuario, criaUsuario, transacoes, criaTransacao }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context)
    throw new Error("useAppContext deve ser usado dentro de um Provider");

  return context;
};
