import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="py-20 bg-gray-100 text-center">
      <div className="container mx-auto px-4">
        <h4 className="text-xl mb-2">Catering Świąteczny 2025</h4>
        <Link to="/catering-swiateczny" className="inline-block bg-primary text-white px-6 py-2 rounded-md mb-8">Zobacz menu</Link>

        <h1 className="text-5xl mb-4">Catering Świąteczny</h1>
        <Link to="/catering-swiateczny" className="inline-block bg-primary text-white px-6 py-2 rounded-md mb-8">Zamów online</Link>

        <h3 className="text-3xl mb-4">Wigilia firmowa na Starym Rynku w Poznaniu</h3>
        <Link to="/wigilia-firmowa-na-starym-rynku-w-poznaniu/" className="inline-block bg-primary text-white px-6 py-2 rounded-md">Check menu</Link>
      </div>
    </section>
  );
}
