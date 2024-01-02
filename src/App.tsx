import { FiTrash } from "react-icons/fi";
import { useEffect, useState, useRef, FormEvent } from "react";
import { api } from "./services/api";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  async function loadCostumers() {
    const resp = await api.get("/customers");
    if (resp.status !== 200) {
      return toast.info("Houve um erro no servidor, tente novamente!");
    }
    setCustomers(resp.data);
  }

  async function sendData(event: FormEvent) {
    event.preventDefault();
    if (!nameRef.current?.value || !emailRef.current?.value) return;

    var data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
    };

    try {
      const resp = await api.post("/customer", data);

      if (resp.status === 200) {
        setCustomers((allCustomers) => [...allCustomers, resp.data]);

        nameRef.current.value = "";
        emailRef.current.value = "";
        toast.success("Cliente cadastrado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar cliente!");
    }
  }

  async function costumerDelete(id: string) {
    try {
      const rest = await api.delete("/customer", {
        params: {
          id: id,
        },
      });

      if (rest.status === 200) {
        const all = customers.filter((x) => x.id !== id);
        setCustomers(all);
        toast.success("Cliente deletado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar cliente!");
    }
  }

  useEffect(() => {
    loadCostumers();
  }, []);

  return (
    <div className="bg-blue-primary">
      <div>
        {/* Outros componentes aqui */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </div>
      <main className=" max-w-4xl m-auto px-6 h-36">
        <header className="pt-14 flex items-center gap-3">
          <div className="bg-green-500 w-2 h-2 rotate-45 bg-secondary"></div>
          <h1 className="text-3xl  font-semibold tracking-wide">Cadastro</h1>
        </header>

        <form className="mt-10 grid gap-8" onSubmit={sendData}>
          <div className="grid gap-2">
            <label className=" font-medium">Nome</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Nome do cliente"
              className="py-3 px-4 rounded-full outline-none bg-transparent border-blue-950 border  focus:border-blue-900 hover:border-blue-900 hover:bg-blue-950/20 focus:bg-blue-950/20 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <label className=" font-medium">E-mail</label>
            <input
              ref={emailRef}
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
                      {customer.name.charAt(0)}
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
                    <button
                      className="border-blue-950 bg-blue-950/20 p-3 rounded-full transition-all hover:bg-blue-950/30 active:bg-blue-950/50"
                      onClick={() => costumerDelete(customer.id)}
                    >
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
