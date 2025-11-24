export default function Resources() {
  const books = [
    { title: 'Book Name', author: 'Author Name', pages: '###', problems: '###' },
    { title: 'Book Name', author: 'Author Name', pages: '###', problems: '###' },
    { title: 'Book Name', author: 'Author Name', pages: '###', problems: '###' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="relative">
        <input type="text" placeholder="Search for a book..." className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-sm text-slate-600 mb-2">{book.author}</p>
            <p className="text-sm text-slate-600 mb-4">{book.pages} pages | {book.problems} problems</p>
            <a href="#" className="text-indigo-600 font-medium hover:underline">View Details</a>
          </div>
        ))}
      </div>
    </main>
  );
}
