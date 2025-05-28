'use client'
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto scroll functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      if (isPlaying) {
        emblaApi.scrollNext();
      }
    }, 2000);

    return () => clearInterval(autoplay);
  }, [emblaApi, isPlaying]);

  const heroSlides = [
    {
      image: "/carousel/SAO-gradient_-_Made_with_PosterMyWall-transformed.jpeg",
      title: "Sword Art Online",
      description: "Enter the virtual world of Aincrad"
    },
    {
      image: "/carousel/classroomofelite-gradient_-_Made_with_PosterMyWall-transformed.jpeg",
      title: "Classroom of the Elite",
      description: "Where meritocracy meets manipulation"
    },
    {
      image: "/carousel/bakemonogatari-gradient_-_Made_with_PosterMyWall-transformed.jpeg",
      title: "Bakemonogatari",
      description: "A supernatural mystery series"
    },
    {
      image: "/carousel/itstartswithus-gradient-transformed.jpeg",
      title: "It Starts With Us",
      description: "A powerful story of love and resilience"
    },
    {
      image: "/carousel/thewindupbird-gradient-transformed.jpeg",
      title: "The Wind-Up Bird Chronicle",
      description: "A masterpiece of magical realism"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel */}
      <section id="home" className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-[#1d293d]">
        <div 
          className="embla overflow-hidden" 
          ref={emblaRef}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div className="embla__container flex">
            {heroSlides.map((slide, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] relative h-[400px] md:h-[500px] lg:h-[600px]">
                <div className="absolute inset-0 bg-[#1d293d]/80 z-10"></div>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-white px-4">
                  <div className="text-center drop-shadow-lg" > {/* Add text shadow for readability */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">{slide.title}</h2>
                    <p className="text-lg md:text-xl mb-4 md:mb-8">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Navigation Buttons */}
        <button 
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-2 rounded-full hover:bg-white"
          onClick={scrollPrev}
        >
          <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#1d293d]" />
        </button>
        <button 
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-2 rounded-full hover:bg-white"
          onClick={scrollNext}
        >
          <FiChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#1d293d]" />
        </button>
      </section>

      {/* Featured Books Section */}
      <section id="featured" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#1d293d]">Featured Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Featured Book Cards */}
            {[
              {
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                price: 699,
                image: "/covers/harryphilosophergryff.jpg"
              },
              {
                title: "Sword Art Online: Alicization",
                author: "Reki Kawahara",
                price: 599,
                image: "/covers/SAOAlici.jpeg"
              },
              {
                title: "No Longer Human",
                author: "Osamu Dazai",
                price: 499,
                image: "/covers/nolongerhuman.jpeg"
              },
              {
                title: "Classroom of the Elite",
                author: "Syougo Kinugasa",
                price: 549,
                image: "/covers/classroomofelites.jpeg"
              },
              {
                title: "It Ends With Us",
                author: "Colleen Hoover",
                price: 599,
                image: "/covers/itendswihtus.jpg"
              },
              {
                title: "The Wind-Up Bird Chronicle",
                author: "Haruki Murakami",
                price: 649,
                image: "/covers/thewindupbird.png"
              }
            ].map((book, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                    <Link href="/shop" className="bg-[#1d293d] text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-[#1d293d]/90 transition-colors text-sm md:text-base">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-[#1d293d]/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#1d293d]">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1d293d]">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md text-[#1d293d] border-[#1d293d]/20 shadow-sm focus:border-[#1d293d] focus:ring-[#1d293d]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1d293d]">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full text-[#1d293d] rounded-md border-[#1d293d]/20 shadow-sm focus:border-[#1d293d] focus:ring-[#1d293d]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#1d293d]">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="mt-1 block w-full rounded-md text-[#1d293d] border-[#1d293d]/20 shadow-sm focus:border-[#1d293d] focus:ring-[#1d293d]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1d293d] text-white px-6 py-3 rounded-lg hover:bg-[#1d293d]/90 transition-colors text-sm md:text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
