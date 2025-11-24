import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Calendar, FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            The Math and Science Academy
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            TMAS empowers students with high-quality, free educational resources
            that make advanced math and science accessible to everyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/books"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded transition-colors inline-flex items-center justify-center"
            >
              Explore FREE Books
            </Link>
            <button className="px-6 py-3 bg-blue-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors">
              Join Community
            </button>
          </div>
        </div>

        {/* Organization Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-slate-200">
          <div className="space-y-2 text-center">
            <BookOpen className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="text-2xl font-semibold text-slate-900">10+</div>
            <div className="text-sm text-slate-600">Free Books</div>
          </div>

          <div className="space-y-2 text-center">
            <FileText className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="text-2xl font-semibold text-slate-900">1000+</div>
            <div className="text-sm text-slate-600">Practice Problems</div>
          </div>

          <div className="space-y-2 text-center">
            <Users className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="text-2xl font-semibold text-slate-900">500+</div>
            <div className="text-sm text-slate-600">Discord Members</div>
          </div>

          <div className="space-y-2 text-center">
            <Calendar className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="text-2xl font-semibold text-slate-900">2021</div>
            <div className="text-sm text-slate-600">Founded</div>
          </div>
        </div>
      </section>

      {/* Our Resources Section */}
      <section className="px-4 py-16 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Our Resources
          </h2>
          {/* Resources content will go here */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Testimonials
          </h2>
          {/* Testimonials content will go here */}
        </div>
      </section>
    </div>
  );
}
