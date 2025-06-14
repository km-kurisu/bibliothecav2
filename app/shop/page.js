'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const categories = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Manga',
  'Romance',
  'Light Novels',
  'Horror',
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
    category: "Non-Fiction",
    image: "/covers/nolongerhuman.jpeg"
  },
  {
    id: 12,
    title: "The Wind-Up Bird Chronicle",
    author: "Haruki Murakami",
    price: 649,
    category: "Self-Help",
    image: "/covers/thewindupbird.png"
  },
  {
    id: 13,
    title: "It Starts With Us",
    author: "Colleen Hoover",
    price: 599,
    category: "Romance",
    image: "/covers/itstartswithus.jpeg"
  },
  {
    id: 14,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    price: 599,
    category: "Romance",
    image: "/covers/itendswihtus.jpg"
  },
  {
    id: 15,
    title: "Out",
    author: "Natsuo Kirino",
    price: 549,
    category: "Horror",
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
    <div className="min-h-screen bg-background">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-foreground text-background px-6 py-3 rounded-lg shadow-lg z-50">
          Item added to cart!
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Shop</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm md:text-base transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-accent/20 hover:border-accent hover:scale-[1.02]">
              <CardContent className="p-0">
                <div className="relative h-64 sm:h-72 md:h-80 bg-muted/5 flex items-center justify-center">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </CardContent>
              <CardHeader className="p-4 md:p-6 pb-0">
                <CardTitle className="text-lg md:text-xl font-semibold mb-2 text-foreground line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-2">{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="px-4 md:px-6 py-0 text-sm md:text-base text-muted-foreground line-clamp-2">
                 A captivating story that will keep you engaged from start to finish.
              </CardContent>
              <CardFooter className="px-4 md:px-6 pt-4 flex justify-between items-center">
                <p className="text-foreground font-semibold">₹{book.price.toFixed(2)}</p>
                <Button
                  onClick={() => handleAddToCart(book)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 