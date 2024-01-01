export default function App() {
  return (
    <div className="bg-blue-primary w-screen h-screen">
      <main className=" max-w-4xl m-auto px-6 h-36">
        <header className="pt-14 flex items-center gap-3">
          <div className="bg-green-500 w-2 h-2 rotate-45 bg-secondary"></div>
          <h1 className="text-3xl text-white font-semibold tracking-wide">
            Cadastro
          </h1>
        </header>

        <form className="mt-10 grid gap-8">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-white font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome do cliente"
              className="py-3 px-4 rounded-full outline-none bg-transparent border-blue-950 border text-white focus:border-blue-900 hover:border-blue-900 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-white font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="text"
              placeholder="E-mail do cliente"
              className="py-3 px-4 rounded-full outline-none bg-transparent border-blue-950 border text-white focus:border-blue-900 hover:border-blue-900 transition-all placeholder:transition-all placeholder:text-gray-300 font-light text-sm focus:placeholder:pl-2 focus:placeholder:text-gray-400"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
