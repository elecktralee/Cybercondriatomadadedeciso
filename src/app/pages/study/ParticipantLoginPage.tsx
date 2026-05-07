import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';

export default function ParticipantLoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Por enquanto, apenas verifica se os campos foram preenchidos
    // e redireciona para o TCLE. Futuramente, conectaremos isso
    // ao banco de dados para buscar os resultados individuais.
    if (login && senha) {
      navigate('/tcle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
            <Lock size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Acesso Restrito</h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          Insira suas credenciais para acessar a pesquisa ou visualizar seus resultados individuais.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Login / E-mail
            </label>
            <input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Digite seu login"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
          >
            Acessar Plataforma
          </button>
        </form>
      </div>
    </div>
  );
}