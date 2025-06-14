'use client'
import Image from 'next/image';
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Bibliotheca</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Your trusted destination for quality books and literature, bringing stories to life one page at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Website Details */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-accent">Our Story</h2>
            <div className="prose prose-lg text-foreground/80 dark:prose-invert">
              <p className="mb-6">
                Bibliotheca was born from a passion for literature and a desire to create a modern, accessible platform for book lovers. 
                We curate a diverse collection of books, from timeless classics to contemporary bestsellers, ensuring there's something 
                for every reader.
              </p>
              <p className="mb-6">
                Our mission is to make quality literature accessible to everyone, fostering a love for reading and creating a community 
                of book enthusiasts. We carefully select each title in our collection, focusing on both popular favorites and hidden gems 
                that deserve recognition.
              </p>
              <p>
                Whether you're a seasoned reader or just starting your literary journey, Bibliotheca is here to guide you through the 
                wonderful world of books. Join us in celebrating the power of storytelling and the joy of reading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-accent text-center">Meet the Developer</h2>

            <Card className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6">
              {/* Developer Image */}
              <div className="relative w-58 h-58 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/Design4.png"
                  alt="Developer"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Developer Info */}
              <div className="flex-grow text-center md:text-left">
                <CardHeader className="p-0 mb-4">
                   <CardTitle className="text-2xl font-bold text-foreground">Kamlesh Mistry</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-foreground/80 mb-6">
                    A passionate full-stack developer with a love for creating beautiful and functional web applications. 
                    With expertise in modern web technologies and a keen eye for design, I strive to build platforms that 
                    not only look great but also provide an exceptional user experience.
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-9">
                    <a 
                      href="https://github.com/km-kurisu`" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      <FiGithub className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/kamlesh-mistry-957895260/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      <FiLinkedin className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.instagram.com/kamleshm_02/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      <FiInstagram className="w-6 h-6" />
                    </a>
                    <a 
                      href="mailto:kamleshkmistry33@gmailcom" 
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      <FiMail className="w-6 h-6" />
                    </a>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-accent text-center">Why Choose Bibliotheca?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold text-accent">Curated Collection</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-foreground/80">
                <p>
                  Carefully selected books across various genres to ensure quality and diversity in our collection.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold text-accent">Easy Shopping</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-foreground/80">
                <p>
                  User-friendly interface designed to make your book shopping experience smooth and enjoyable.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
               <CardHeader className="p-0 mb-4">
                 <CardTitle className="text-xl font-semibold text-accent">Secure Checkout</CardTitle>
               </CardHeader>
               <CardContent className="p-0 text-foreground/80">
                 <p>
                   Safe and secure payment processing to ensure your shopping experience is worry-free.
                 </p>
               </CardContent>
             </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 