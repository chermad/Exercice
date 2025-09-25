
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-6 sm:px-6 md:px-12 lg:px-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">Voilà le résultat de l'exercice demandé</h1>
      <p className="mb-4 sm:mb-8 text-base sm:text-lg text-gray-700 text-center">Consultez le PDF de l'exercice ci-dessous :</p>
      <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl h-[350px] sm:h-[500px] md:h-[600px] border rounded shadow overflow-hidden">
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
