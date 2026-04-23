import { Link } from "react-router-dom";

export function KuchniaRegionalnaSection() {
  return (
    <section className="py-16 bg-white text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-4">Kuchnia regionalna</h1>
        
        <h4 className="text-xl mb-4">Zobacz menu a’la carte</h4>
        <Link to="/menu/dania-glowne/" className="inline-block bg-primary text-white px-6 py-2 rounded-md mb-8">Zobacz menu</Link>

        <h4 className="text-xl mb-4">Zorganizujemy Twoje przyjęcie</h4>
        <Link to="/oferta/" className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md">Zobacz ofertę</Link>
      </div>
    </section>
  );
}
