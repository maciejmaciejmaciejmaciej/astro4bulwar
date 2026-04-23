import { Link } from "react-router-dom";

export function KawaSection() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl mb-6">Kawa na wynos w Bulwarze!</h1>
        <p className="text-lg mb-8">
          Wiemy jak ważna jest kawa. Aby była dobra, aby smakowała tak jak lubisz wybierz mleko, na którym mamy ją przygotować. Wybieraj spośród krowiego tłustego, sojowego, bez laktozy lub owsianego. Nasze wszystkie kawy są także dostępne w opcji bez kofeiny.
        </p>
        <Link to="/menu/sniadania-breakfast/" className="inline-block bg-primary text-white px-6 py-2 rounded-md">Zobacz menu sniadaniowe</Link>
      </div>
    </section>
  );
}
