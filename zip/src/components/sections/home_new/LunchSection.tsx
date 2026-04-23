import { Link } from "react-router-dom";

export function LunchSection() {
  return (
    <section className="py-16 bg-white text-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl mb-6">Masz bardzo ważny lunch!</h1>
        <p className="text-lg mb-8">
          Regionalne produkty oraz najwyższej jakości składniki tworzące dania to codzienność w porze lunchu w Bulwarze. Zrób sobie przerwę!
        </p>
        <Link to="/menu/lunch/" className="inline-block bg-primary text-white px-6 py-2 rounded-md">Menu lunch</Link>
      </div>
    </section>
  );
}
