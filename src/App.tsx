import { FiTrash } from "react-icons/fi";
import { useEffect, useState } from "react";
import { api } from "./services/api";
import moment from "moment";

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);

  useEffect(() => {
    loadCostumers();
  }, []);

  async function loadCostumers() {
    const resp = await api.get("/customers");
    if (resp.status === 200) {
      setCustomers(resp.data);
    }
  }

  return (
    <div className="bg-blue-primary w-screen h-screen">
      <main className=" max-w-4xl m-auto px-6 h-36">
        <header className="pt-14 flex items-center gap-3">
          <div className="bg-green-500 w-2 h-2 rotate-45 bg-secondary"></div>
          <h1 className="text-3xl  font-semibold tracking-wide">Cadastro</h1>
        </header>

        <form className="mt-10 grid gap-8">
          <div className="grid gap-2">
            <label className=" font-medium">Nome</label>
            <input
              type="text"
              placeholder="Nome do cliente"
              className="py-3 px-4 rounded-full outline-none bg-transparent border-blue-950 border  focus:border-blue-900 hover:border-blue-900 hover:bg-blue-950/20 focus:bg-blue-950/20 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <label className=" font-medium">E-mail</label>
            <input
              type="email"
              placeholder="E-mail do cliente"
              className="py-3 px-4 rounded-full outline-none bg-transparent border-blue-950 border  focus:border-blue-900 hover:border-blue-900 hover:bg-blue-950/20 focus:bg-blue-950/20 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>
          <input
            type="submit"
            value="Cadastrar"
            className=" bg-blue-950 w-full py-3 px-4 rounded-full tracking-wide transition-all hover:border-blue-900 hover:bg-blue-950/20 active:bg-blue-950/50 border border-transparent cursor-pointer hover:scale-[0.995]"
          />
        </form>

        <section>
          <header className="pt-14 flex items-center gap-3">
            <div className="bg-green-500 w-2 h-2 rotate-45 bg-secondary"></div>
            <h1 className="text-3xl  font-semibold tracking-wide">
              Clientes cadastrados
            </h1>
          </header>

          <table className="table border-separate text-sm w-full py-6 ">
            <thead>
              <tr>
                <th className="py-3 w-20 text-left text-base font-medium"></th>
                <th className="py-3 text-left text-base font-medium">Nome</th>
                <th className="py-3 text-left text-base font-medium">E-mail</th>
                <th className="py-3 text-base font-medium">Status</th>
                <th className="py-3 text-base font-medium text-center">
                  Cadastrado em
                </th>
                <th className="py-3 text-base font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="bg-dark-secondary/5 text-white-secondary transition-all hover:scale-[0.995]"
                >
                  <td>
                    <div className=" h-6 w-6 rounded-full border border-blue-950 bg-blue-950/20 uppercase flex items-center justify-center p-5 text-sm">
                      p
                    </div>
                  </td>
                  <td className="py-3 font-light text-gray-200">
                    {customer.name}
                  </td>
                  <td className="py-3 font-light text-gray-200">
                    {customer.email}
                  </td>
                  <td className="py-6 font-light text-gray-200 text-center flex gap-2 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>{customer.status ? "Ativo" : "Inativo"}</p>
                  </td>
                  <td className="py-3 font-light text-gray-200 text-center">
                    {moment(customer.created_at).format(
                      "DD/MM/YYYY [às] HH:mm"
                    )}
                  </td>
                  <td className="py-3 font-light text-gray-200 text-right">
                    <button className="border-blue-950 bg-blue-950/20 p-3 rounded-full transition-all hover:bg-blue-950/30 active:bg-blue-950/50">
                      <FiTrash size={15} color="#fff" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
