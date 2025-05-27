'use client'
import Image from 'next/image';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#1d293d] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Bibliotheca</h1>
            <p className="text-lg md:text-xl text-white/80">
              Your trusted destination for quality books and literature, bringing stories to life one page at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Website Details */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-[#1d293d]">Our Story</h2>
            <div className="prose prose-lg text-[#1d293d]/80">
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
      <section className="py-16 md:py-24 bg-[#1d293d]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-[#1d293d] text-center">Meet the Developer</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
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
                <h3 className="text-2xl font-bold mb-4 text-[#1d293d]">Kamlesh Mistry</h3>
                <p className="text-[#1d293d]/80 mb-6">
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
                    className="text-[#1d293d] hover:text-[#1d293d]/80 transition-colors"
                  >
                    <FiGithub className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1d293d] hover:text-[#1d293d]/80 transition-colors"
                  >
                    <FiLinkedin className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://twitter.com/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1d293d] hover:text-[#1d293d]/80 transition-colors"
                  >
                    <FiTwitter className="w-6 h-6" />
                  </a>
                  <a 
                    href="mailto:kamleshkmistry33@gmailcom" 
                    className="text-[#1d293d] hover:text-[#1d293d]/80 transition-colors"
                  >
                    <FiMail className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-[#1d293d] text-center">Why Choose Bibliotheca?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#1d293d]">Curated Collection</h3>
              <p className="text-[#1d293d]/80">
                Carefully selected books across various genres to ensure quality and diversity in our collection.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#1d293d]">Easy Shopping</h3>
              <p className="text-[#1d293d]/80">
                User-friendly interface designed to make your book shopping experience smooth and enjoyable.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#1d293d]">Secure Checkout</h3>
              <p className="text-[#1d293d]/80">
                Safe and secure payment processing to ensure your shopping experience is worry-free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 