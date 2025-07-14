// app/not-found.tsx

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
      <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
      <p className="text-lg text-gray-600 mb-6">
        A página que procuras não existe ou nã tem direito a acede-la.
      </p>
      <a
        href="/"
        className=" underline hover:text-blue-800"
      >
        Voltar à página inicial
      </a>
    </div>
  );
}
