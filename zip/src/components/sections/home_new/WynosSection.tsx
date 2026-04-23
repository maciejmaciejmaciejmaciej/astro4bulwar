import { Link } from "react-router-dom";

export function WynosSection() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl mb-2">BulwaR na wynos</h2>
        <p className="text-lg">Dowozy</p>
        <Link to="/dowoz" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md">MENU Zamów online</Link>
      </div>
    </section>
  );
}
