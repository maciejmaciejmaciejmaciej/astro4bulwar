import { Link } from "react-router-dom";

export function WiniarniaSection() {
  return (
    <section className="py-16 bg-white text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-4">Winiarnia w Bulwarze</h1>
        <h4 className="text-xl mb-6">Zapraszamy do naszej winiarni</h4>
        <Link to="/menu/karta-win/" className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md">więcej…</Link>
      </div>
    </section>
  );
}
