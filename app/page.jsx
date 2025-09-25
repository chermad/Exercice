
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Voilà le résultat de l'exercice demandé</h1>
      <p className="mb-8 text-lg text-gray-700">Consultez le PDF de l'exercice ci-dessous :</p>
      <div className="w-full max-w-2xl h-[600px] border rounded shadow overflow-hidden">
        <iframe
          src="/exercice.pdf"
          title="Exercice PDF"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
