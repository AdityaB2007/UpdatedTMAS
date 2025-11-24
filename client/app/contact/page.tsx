export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <form className="bg-white p-6 rounded-lg shadow space-y-4">
        <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200" />
        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200" />
        <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"></textarea>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
          Send Message
        </button>
      </form>

      <div className="text-center">
        <p className="text-slate-700">Or reach out directly:</p>
        <p className="font-medium">tmasacademy@gmail.com</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-indigo-600 hover:underline">Instagram</a>
          <a href="#" className="text-indigo-600 hover:underline">LinkedIn</a>
          <a href="#" className="text-indigo-600 hover:underline">Discord</a>
        </div>
      </div>
    </main>
  );
}
