'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/cart';

const categories = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Manga',
  'Light Novels',
  'Biography',
  'Self-Help'
];

const books = [
  {
    id: 1,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 699,
    category: "Fiction",
    image: "/covers/harryphilosophergryff.jpg"
  },
  {
    id: 2,
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    price: 799,
    category: "Fiction",
    image: "/covers/harrychamberslyther.jpg"
  },
  {
    id: 3,
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    price: 749,
    category: "Fiction",
    image: "/covers/harryprisonerhufflepu.jpg"
  },
  {
    id: 4,
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    price: 849,
    category: "Fiction",
    image: "/covers/harrygobletraven.jpg"
  },
  {
    id: 5,
    title: "Harry Potter and the Order of the Phoenix",
    author: "J.K. Rowling",
    price: 799,
    category: "Fiction",
    image: "/covers/harrypheonixraven.jpg"
  },
  {
    id: 6,
    title: "Harry Potter and the Half-Blood Prince",
    author: "J.K. Rowling",
    price: 849,
    category: "Fiction",
    image: "/covers/harryhalfslytherin.jpg"
  },
  {
    id: 7,
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    price: 899,
    category: "Fiction",
    image: "/covers/harryhallowsgryffin.jpg"
  },
  {
    id: 8,
    title: "Sword Art Online: Alicization",
    author: "Reki Kawahara",
    price: 599,
    category: "Light Novels",
    image: "/covers/SAOAlici.jpeg"
  },
  {
    id: 9,
    title: "Classroom of the Elite",
    author: "Syougo Kinugasa",
    price: 549,
    category: "Light Novels",
    image: "/covers/classroomofelites.jpeg"
  },
  {
    id: 10,
    title: "Bakemonogatari",
    author: "Nisio Isin",
    price: 599,
    category: "Light Novels",
    image: "/covers/bakemonogatari.jpeg"
  },
  {
    id: 11,
    title: "No Longer Human",
    author: "Osamu Dazai",
    price: 499,
    category: "Fiction",
    image: "/covers/nolongerhuman.jpeg"
  },
  {
    id: 12,
    title: "The Wind-Up Bird Chronicle",
    author: "Haruki Murakami",
    price: 649,
    category: "Fiction",
    image: "/covers/thewindupbird.png"
  },
  {
    id: 13,
    title: "It Starts With Us",
    author: "Colleen Hoover",
    price: 599,
    category: "Fiction",
    image: "/covers/itstartswithus.jpeg"
  },
  {
    id: 14,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    price: 599,
    category: "Fiction",
    image: "/covers/itendswihtus.jpg"
  },
  {
    id: 15,
    title: "Out",
    author: "Natsuo Kirino",
    price: 549,
    category: "Fiction",
    image: "/covers/out.jpeg"
  }
];

export default function Shop() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNotification, setShowNotification] = useState(false);

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleAddToCart = (book) => {
    addToCart(book);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-[#1d293d] text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Item added to cart!
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#1d293d]">Shop</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                selectedCategory === category
                  ? 'bg-[#1d293d] text-white'
                  : 'bg-[#1d293d]/5 text-[#1d293d] hover:bg-[#1d293d]/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 sm:h-72 md:h-80 bg-[#1d293d]/5 flex items-center justify-center">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#1d293d] line-clamp-2">{book.title}</h3>
                <p className="text-[#1d293d]/70 mb-2">{book.author}</p>
                <p className="text-[#1d293d]/70 mb-4 text-sm md:text-base">A captivating story that will keep you engaged from start to finish.</p>
                <div className="flex justify-between items-center">
                  <p className="text-[#1d293d] font-semibold">₹{book.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="bg-[#1d293d] text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-[#1d293d]/90 transition-colors text-sm md:text-base"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 