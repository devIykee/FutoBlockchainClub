"use client";

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { X, MessageCircle, Mail, Link2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/socials';

export function CommunityClient() {
  const platforms = [
    {
      name: 'X (Twitter)',
      icon: X,
      description: 'Build updates, announcements, and community highlights',
      cta: 'Follow',
      link: SOCIAL_LINKS.fbcX,
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      description: 'Real-time discussions, event updates, and community chat',
      cta: 'Join',
      link: SOCIAL_LINKS.fbcTelegram,
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      description: 'Quick updates and direct community communication',
      cta: 'Join',
      link: SOCIAL_LINKS.fbcWhatsApp,
      color: 'from-green-400 to-green-600',
    },
    {
      name: 'LinkedIn',
      icon: Link2,
      description: 'Professional updates and career opportunities',
      cta: 'Connect',
      link: 'https://linkedin.com/company/fbcfuto',
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Newsletter',
      icon: Mail,
      description: 'Weekly digest of events, bounties, and insights',
      cta: 'Subscribe',
      link: '#',
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Blog',
      icon: Music,
      description: 'In-depth articles on blockchain, Web3, and community stories',
      cta: 'Read',
      link: '#',
      color: 'from-orange-400 to-orange-600',
    },
  ];

  const recentEvents = [
    {
      title: 'Smart Contract Fundamentals Workshop',
      date: 'August 15, 2026',
      description: 'Learn the basics of Solidity and deploy your first smart contract on testnet.',
    },
    {
      title: 'Monthly Hackathon: DeFi Challenge',
      date: 'August 22-24, 2026',
      description: 'Build innovative DeFi solutions and compete for ₦500,000 in prizes.',
    },
    {
      title: 'Community Meetup & Networking',
      date: 'August 28, 2026',
      description: 'Connect with fellow builders, share projects, and discuss Web3 trends.',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Community
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Stay Connected
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              FBC is spread across multiple platforms. Each one serves a different purpose - find where you want to connect and join the conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Cards Grid */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {platforms.map((platform, i) => {
              const Icon = platform.icon;
              return (
                <motion.a
                  key={i}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  custom={i}
                  className={`group relative p-8 rounded-xl bg-gradient-to-br ${platform.color} text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  whileHover={{ y: -4 }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:20px_20px]" />
                  </div>

                  <div className="relative z-10">
                    <Icon className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                    <p className="text-white/90 text-sm mb-6 leading-relaxed">
                      {platform.description}
                    </p>
                    <Button
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                      size="sm"
                    >
                      {platform.cta}
                    </Button>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              What&rsquo;s Happening
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Recent Community Events
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {recentEvents.map((event, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="bg-white dark:bg-gray-950 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3">{event.date}</p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg">
              See All Events
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}