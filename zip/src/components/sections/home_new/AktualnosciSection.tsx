import { Link } from "react-router-dom";

export function AktualnosciSection() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-8">Oferta specjalna</h1>
        <h3 className="text-2xl mb-6">Aktualności</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="mb-2">test</h4>
            <Link to="/test/" className="text-primary hover:underline">test</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="mb-2">25.11.24 do 23.12.24</h4>
            <p className="mb-4">Sprzedaż świątecznego cateringu</p>
            <Link to="/25-11-24-do-23-12-24/" className="text-primary hover:underline">Czytaj więcej</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="mb-2">25.11.24 do 12.01.25</h4>
            <p className="mb-4">Terminy, na które przyjmujemy rezerwacje na imprezy firmowe świąteczne.</p>
            <Link to="/25-11-24-do-12-01-25/" className="text-primary hover:underline">Czytaj więcej</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
