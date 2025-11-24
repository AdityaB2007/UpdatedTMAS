export default function About() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Mission & Vision</h2>
        <p className="text-slate-700 leading-relaxed">
          TMAS Academy's mission is to make advanced math and science accessible to every student, regardless of their background.
          We envision a world where talent is nurtured through opportunity, not limited by circumstances.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-slate-700 leading-relaxed">
          TMAS Academy was born from the belief that knowledge should be free. What started as a small initiative to share free learning resources
          has grown into a community empowering students across the world to pursue STEM education with confidence and support.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Jako', 'Mahado', 'Dainna', 'Katelyn'].map((name) => (
            <div key={name} className="bg-white p-4 rounded-lg shadow text-center">
              <img src="https://via.placeholder.com/100" alt={`${name} - Team member`} className="mx-auto rounded-full mb-2" />
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-slate-600">Core Member</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
