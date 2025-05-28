'use client'
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#1d293d] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-white/80">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#1d293d]">Get in Touch</h2>
                <p className="text-[#1d293d]/80 mb-8">
                  We're here to help and answer any questions you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1d293d]/5 p-3 rounded-lg">
                    <FiMail className="w-6 h-6 text-[#1d293d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d293d] mb-1">Email</h3>
                    <p className="text-[#1d293d]/80">Kamleshkmmistry33@gmai.com</p>
                    <p className="text-[#1d293d]/80">nexdevcorp@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1d293d]/5 p-3 rounded-lg">
                    <FiPhone className="w-6 h-6 text-[#1d293d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d293d] mb-1">Phone</h3>
                    <p className="text-[#1d293d]/80">+91 81778 66278</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1d293d]/5 p-3 rounded-lg">
                    <FiMapPin className="w-6 h-6 text-[#1d293d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d293d] mb-1">Address</h3>
                    <p className="text-[#1d293d]/80">123 Book Street</p>
                    <p className="text-[#1d293d]/80">Reading City, RC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-lg border border-[#1d293d]/10">
              <h2 className="text-2xl font-bold mb-6 text-[#1d293d]">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1d293d] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#1d293d]/20 focus:border-[#1d293d] focus:ring-2 focus:ring-[#1d293d] outline-none transition-colors bg-white text-[#1d293d] placeholder:text-[#1d293d]/40"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1d293d] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#1d293d]/20 focus:border-[#1d293d] focus:ring-2 focus:ring-[#1d293d] outline-none transition-colors bg-white text-[#1d293d] placeholder:text-[#1d293d]/40"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#1d293d] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#1d293d]/20 focus:border-[#1d293d] focus:ring-2 focus:ring-[#1d293d] outline-none transition-colors bg-white text-[#1d293d] placeholder:text-[#1d293d]/40"
                    placeholder="Subject"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1d293d] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-[#1d293d]/20 focus:border-[#1d293d] focus:ring-2 focus:ring-[#1d293d] outline-none transition-colors bg-white text-[#1d293d] placeholder:text-[#1d293d]/40"
                    placeholder="Type your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1d293d] text-white px-6 py-3 rounded-lg hover:bg-[#13203a] transition-colors text-base font-semibold flex items-center justify-center gap-2 shadow-md"
                >
                  <FiSend className="inline-block" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-[#1d293d]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-[#1d293d] text-center">Find Us</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043087964!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}