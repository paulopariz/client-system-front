import { FiTrash, FiEdit3 } from "react-icons/fi";
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
  const [status, setStatus] = useState<string>("");
  const isEdit = useRef<boolean>(false);
  const idEdit = useRef<string>("");

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  async function closeEdit() {
    if (nameRef.current && emailRef.current) {
      nameRef.current.value = "";
      emailRef.current.value = "";
      setStatus("");
      isEdit.current = false;
    }
  }

  async function loadCostumers() {
    const resp = await api.get("/customers");
    if (resp.status !== 200) {
      return toast.info("Houve um erro no servidor, tente novamente!");
    }
    setCustomers(resp.data);
  }

  async function sendData(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value || status === "")
      return toast.info("Preencha todos os campos!");

    var data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      status: status === "ativo" ? true : false,
    };

    try {
      const resp = await api.post("/customer", data);

      if (resp.status === 200) {
        setCustomers((allCustomers) => [...allCustomers, resp.data]);

        nameRef.current.value = "";
        emailRef.current.value = "";
        setStatus("");
        toast.success("Cliente cadastrado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar cliente!");
    }
  }

  async function updateData(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value || status === "")
      return toast.info("Preencha todos os campos!");

    var data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      status: status === "ativo" ? true : false,
    };
    try {
      const resp = await api.put(`/customer/${idEdit.current}`, data);

      if (resp.status === 200) {
        setCustomers((allCustomers) => {
          const index = allCustomers.findIndex(
            (customer) => customer.id === resp.data.id
          );

          if (index !== -1) {
            const updatedCustomers = [...allCustomers];
            updatedCustomers[index] = resp.data;
            console.log("updatedCustomers", updatedCustomers);

            return updatedCustomers;
          } else {
            return allCustomers;
          }
        });

        //limpa os dados
        nameRef.current.value = "";
        emailRef.current.value = "";
        setStatus("");
        isEdit.current = false;
        toast.success("Dados do cliente atualizados com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar cliente!");
    }
  }

  async function isUpdate(data: CustomerProps) {
    try {
      if (data && nameRef.current && emailRef.current) {
        nameRef.current.value = data.name;
        emailRef.current.value = data.email;
        setStatus(data.status === true ? "ativo" : "inativo");

        idEdit.current = data.id;

        isEdit.current = true;
      }
    } catch (error) {
      toast.error("Houve algum erro, tente novamente!");
    }
  }

  async function costumerDelete(id: string) {
    try {
      const resp = await api.delete("/customer", {
        params: {
          id: id,
        },
      });

      if (resp.status === 200) {
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
          <div className="bg-blue-900 w-2 h-2 rotate-45 bg-secondary"></div>
          <h1 className="text-3xl  font-semibold tracking-wide">Cadastro</h1>
        </header>

        <form
          className="mt-10 grid gap-8"
          onSubmit={isEdit.current === false ? sendData : updateData}
        >
          <div className="grid gap-2">
            <label className=" font-medium">Nome</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Nome do cliente"
              className="py-3.5 px-6 rounded-full outline-none bg-transparent border-blue-950 border  focus:border-blue-900 hover:border-blue-900 hover:bg-blue-950/20 focus:bg-blue-950/20 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <label className=" font-medium">E-mail</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="E-mail do cliente"
              className="py-3.5 px-6 rounded-full outline-none bg-transparent border-blue-950 border  focus:border-blue-900 hover:border-blue-900 hover:bg-blue-950/20 focus:bg-blue-950/20 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <label className=" font-medium">E-mail</label>
            <div className="flex gap-10">
              <div className="inline-flex items-center">
                <label
                  className="relative flex items-center p-3 rounded-full cursor-pointer"
                  htmlFor="html"
                >
                  <input
                    name="type"
                    type="radio"
                    value="ativo"
                    checked={status === "ativo"}
                    onChange={() => handleStatusChange("ativo")}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-900 checked:before:bg-blue-900 hover:before:opacity-10 border-gray-400"
                  />
                  <span className="absolute text-blue-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px font-light  cursor-pointer select-none"
                  htmlFor="html"
                >
                  Ativo
                </label>
              </div>
              <div className="inline-flex items-center">
                <label className="relative flex items-center p-3 rounded-full cursor-pointer">
                  <input
                    name="type"
                    type="radio"
                    value="inativo"
                    checked={status === "inativo"}
                    onChange={() => handleStatusChange("inativo")}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-900 checked:before:bg-blue-900 hover:before:opacity-10  border-gray-400"
                  />
                  <span className="absolute text-blue-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label className="mt-px font-light  cursor-pointer select-none">
                  Inativo
                </label>
              </div>
            </div>
          </div>

          {!isEdit.current === true ? (
            <input
              type="submit"
              value="Cadastrar"
              className=" bg-blue-950 w-full py-3 px-4 rounded-full tracking-wide transition-all hover:border-blue-900 hover:bg-blue-950/20 active:bg-blue-950/50 border border-transparent cursor-pointer hover:scale-[0.995]"
            />
          ) : (
            <input
              type="submit"
              value="Atualizar dados"
              className=" bg-blue-950 w-full py-3 px-4 rounded-full tracking-wide transition-all hover:border-blue-900 hover:bg-blue-950/20 active:bg-blue-950/50 border border-transparent cursor-pointer hover:scale-[0.995]"
            />
          )}
        </form>
        {isEdit.current && (
          <button
            onClick={closeEdit}
            className=" bg-red-950 w-full mt-3 py-3 px-4 rounded-full tracking-wide transition-all hover:border-red-900 hover:bg-red-950/20 active:bg-red-950/50 border border-transparent cursor-pointer hover:scale-[0.995]"
          >
            Cancelar
          </button>
        )}

        <section>
          <header className="pt-14 flex items-center gap-3">
            <div className="bg-blue-900 w-2 h-2 rotate-45 bg-secondary"></div>
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
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="bg-dark-secondary/5 text-white-secondary transition-all hover:scale-[0.995]"
                  >
                    <td>
                      <div className=" h-6 w-6 rounded-full border border-blue-950 bg-blue-950/20 uppercase flex items-center justify-center p-5 text-sm">
                        {customer.name.charAt(0)}
                      </div>
                    </td>
                    <td className="py-3 font-light text-gray-200 max-w-24 overflow-hidden text-ellipsis pr-1">
                      {customer.name}
                    </td>
                    <td className="py-3 font-light text-gray-200 max-w-24 overflow-hidden text-ellipsis pr-1">
                      {customer.email}
                    </td>
                    <td className="py-6 font-light text-gray-200 text-center flex gap-2 items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          customer.status ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <p>{customer.status === true ? "Ativo" : "Inativo"}</p>
                    </td>
                    <td className="py-3 font-light text-gray-200 text-center">
                      {moment(customer.created_at).format(
                        "DD/MM/YYYY [às] HH:mm"
                      )}
                    </td>
                    <td className="py-3 flex gap-2 items-center justify-end font-light text-gray-200 text-right">
                      <button
                        className="border-blue-950 bg-blue-950/20 p-3 rounded-full transition-all hover:bg-blue-950/30 active:bg-blue-950/50"
                        onClick={() => isUpdate(customer)}
                      >
                        <FiEdit3 size={15} color="#fff" />
                      </button>

                      <button
                        className="border-blue-950 bg-blue-950/20 p-3 rounded-full transition-all hover:bg-blue-950/30 active:bg-blue-950/50"
                        onClick={() => costumerDelete(customer.id)}
                      >
                        <FiTrash size={15} color="#fff" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="mt-20 absolute left-1/2 -translate-x-1/2">
                  <td className="text-gray-300">Carregando...</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
