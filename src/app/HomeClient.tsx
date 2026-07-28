"use client";

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { CountUp } from '@/components/CountUp';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Code, Users, Trophy, BookOpen, Scale } from 'lucide-react';
import { useState, useEffect } from 'react';

const GalleryImage = ({ index }: { index: number }) => {
  const labels = [
    { topLeft: 'FBC', topRight: 'FUTO', bottom: 'FBC' },
    { topLeft: 'FBC', topRight: 'FUTO', bottom: 'FBC' },
    { topLeft: 'FBC', topRight: 'FUTO', bottom: 'FBC' },
    { topLeft: 'FBC', topRight: 'FUTO', bottom: 'FBC' },
  ];
  const label = labels[index % labels.length];
  const rotations = [-4, 2, -3, 4];
  const rotate = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: rotate }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl border-2 border-green-500 cursor-pointer shadow-lg hover:shadow-xl"
    >
      <Image
        src={index % 2 === 0 ? "/logo.svg" : "/logo-source.jpg"}
        alt={`FBC community ${index + 1}`}
        width={600}
        height={400}
        className="w-full h-72 object-cover"
      />
      <div className="absolute bottom-2 left-2 right-2 bg-green-600 text-white text-xs p-2 text-center">
        {label.bottom}
      </div>
      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
        {label.topLeft}
      </div>
      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
        {label.topRight}
      </div>
    </motion.div>
  );
};

export function HomeClient() {
  const [email, setEmail] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const stats = [
    { number: 500, label: 'Total Members' },
    { number: 45, label: 'Events Held' },
    { number: 250000, label: 'Prizes Distributed', suffix: '₦' },
    { number: 120, label: 'Active Builders' },
  ];

  const pillarsBase = [
    {
      icon: Code,
      title: 'Events & Workshops',
      description: 'Learn blockchain development through hands-on workshops and community events.',
    },
    {
      icon: Trophy,
      title: 'Bounties & Hackathons',
      description: 'Compete for prizes and build real projects on-chain with our community.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with Web3 builders, share ideas, and grow together.',
    },
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Access resources and mentorship to master blockchain technology.',
    },
    {
      icon: Scale, 
      title: 'Research & Governance',
      description: 'Contribute to web3 research papers and participate in active DAO voting protocols.',
    },
  ];

  const pillars = pillarsBase;

  const testimonials = [
    {
      quote: 'FBC helped me transition from traditional dev to Web3. The community is incredibly supportive.',
      author: 'Chioma O.',
      role: 'Smart Contract Developer',
    },
    {
      quote: 'The hackathons are where I shipped my first dApp. Best learning experience ever.',
      author: 'Tunde A.',
      role: 'Full-stack Builder',
    },
    {
      quote: 'Being part of FBC opened doors I never knew existed in the blockchain space.',
      author: 'Zainab M.',
      role: 'Product Designer',
    },
    {
      quote: 'The bounties pushed me to learn Solidity in a weekend. I won my first prize within a month.',
      author: 'David K.',
      role: 'Blockchain Developer',
    },
    {
      quote: 'FBC is more than a club. Its a family that builds together and grows together.',
      author: 'Amina S.',
      role: 'Community Manager',
    },
    {
      quote: 'From zero to shipping on mainnet. The mentorship here is unmatched.',
      author: 'Emeka N.',
      role: 'Protocol Engineer',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 pt-20">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#013AEC_1px,transparent_1px),linear-gradient(to_bottom,#013AEC_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.005, color: '#1d4ed8' }}
            >
              Build, Learn, and Ship On-Chain
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              FUTO Blockchain Club is where serious builders meet. Workshops, bounties, hackathons, and a thriving community of Web3 developers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-7 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.01 }}
            >
              <Link href="/community">
                <Button className="px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Join FBC
                </Button>
              </Link>
              <Link href="/ledger-contest">
                <Button className="px-8 py-6 text-white font-semibold rounded-full text-blue-600 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  View Contest
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="text-center p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  <CountUp
                    end={stat.number}
                    suffix={stat.suffix || ''}
                    duration={2000}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center"
              whileHover={{ scale: 1.05, color: '#1d4ed8' }}
            >
              FBC Gallery
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <GalleryImage index={0} />
              <GalleryImage index={1} />
              <GalleryImage index={2} />
              <GalleryImage index={3} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <motion.p
              className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4"
              whileHover={{ color: '#1d4ed8', x: 5 }}
            >
              Our Pillars
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
              whileHover={{ scale: 1.01 }}
            >
              What We Do
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              const isFeatured = i === 0;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  custom={i}
                  className={`p-8 rounded-xl cursor-pointer transition-all duration-150 ${
                    isFeatured
                      ? 'bg-blue-600 text-white lg:row-span-2 shadow-xl'
                      : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800'
                  }`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon className={`w-8 h-8 mb-4 transition-colors duration-300 ${isFeatured ? 'text-blue-100' : 'text-blue-600'}`} />
                  <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                  <p className={`text-sm leading-relaxed ${isFeatured ? 'text-blue-50' : 'text-gray-600 dark:text-gray-400'}`}>
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-blue-50 dark:bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <motion.p
              className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4"
              whileHover={{ color: '#1d4ed8', x: 5 }}
            >
              Community Voices
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
              whileHover={{ scale: 1.01 }}
            >
              What Our Members Say
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-3xl mx-auto"
          >
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-950 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg cursor-pointer"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed text-center">
                &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
              </p>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">{testimonials[testimonialIndex].author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{testimonials[testimonialIndex].role}</p>
              </div>
            </motion.div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${i === testimonialIndex ? 'bg-green-600 scale-125' : 'bg-gray-300 hover:bg-green-400'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h2
              className="text-4xl font-bold text-white mb-4"
              whileHover={{ scale: 1.02, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
            >
              Stay in the Loop
            </motion.h2>
            <motion.p
              className="text-blue-100 mb-8"
              whileHover={{ color: '#ffffff' }}
            >
              Get updates on events, bounties, and community highlights delivered to your inbox.
            </motion.p>

            <motion.div className="flex gap-3" whileHover={{ scale: 1.01 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-md"
              />
              <Button className="px-8 py-7 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Subscribe
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}