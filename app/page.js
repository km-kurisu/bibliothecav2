'use client'
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

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
    }, 5000);

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
    <div className="min-h-screen bg-background">
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
                <div className={`absolute inset-0 bg-[#1d293d]/60 z-10`}></div>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-white dark:text-white">{slide.title}</h2>
                    <p className="text-lg md:text-xl mb-4 md:mb-8 text-white dark:text-white">{slide.description}</p>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/shop">Shop Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Navigation Buttons */}
        <Button 
          variant="ghost"
          size="icon"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 text-primary-foreground hover:text-primary-foreground/80"
          onClick={scrollPrev}
        >
          <FiChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 text-primary-foreground hover:text-primary-foreground/80"
          onClick={scrollNext}
        >
          <FiChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </section>

      {/* Featured Books Section */}
      <section id="featured" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Featured Books</h2>
            <p className="text-muted-foreground">Discover our handpicked selection of must-read books</p>
          </div>
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
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-accent/20 hover:border-accent">
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
                  <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6 py-2 text-sm md:text-base text-muted-foreground">
                  A captivating story that will keep you engaged from start to finish.
                </CardContent>
                <CardFooter className="px-4 md:px-6 pt-0 flex justify-between items-center">
                  <p className="font-semibold">₹{book.price.toFixed(2)}</p>
                  <Button size="sm" asChild>
                    <Link href="/shop">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-8 bg-accent/20" />

    </div>
  );
}
