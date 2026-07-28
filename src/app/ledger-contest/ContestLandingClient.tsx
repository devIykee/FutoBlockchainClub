"use client";

import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Link from 'next/link';
import { ArrowRight, Users, Gift, TrendingUp } from 'lucide-react';
import { CONTEST_END } from '@/lib/constants';

export function ContestLandingClient() {
  const deadline = CONTEST_END;

  const steps = [
    {
      number: 1,
      title: 'Join Ledger Community',
      description: 'Join the Ledger Telegram community to stay updated on the contest.',
      cta: 'Join Telegram',
      link: 'https://t.me/ledger',
    },
    {
      number: 2,
      title: 'Join FBC',
      description: 'Become part of FUTO Blockchain Club on Telegram.',
      cta: 'Join FBC',
      link: 'https://t.me/fbcfuto',
    },
    {
      number: 3,
      title: 'Follow FBC on X',
      description: 'Follow our X account for updates and announcements.',
      cta: 'Follow Now',
      link: 'https://twitter.com/fbcfuto',
    },
    {
      number: 4,
      title: 'Share & Climb',
      description: 'Share your referral link and climb the leaderboard.',
      cta: 'Get Link',
      link: '/ledger-contest/signup',
    },
  ];

  const prizePool = [
    { rank: '1st Place', prize: '₦200,000', icon: '🥇' },
    { rank: '2nd Place', prize: '₦100,000', icon: '🥈' },
    { rank: '3rd Place', prize: '₦50,000', icon: '🥉' },
    { rank: '4th - 10th', prize: '₦10,000 each', icon: '🎁' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-950 pt-20">
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
            >
              Ledger Referral Contest
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Invite friends, climb the leaderboard, and win amazing prizes. The more you share, the higher you climb.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-8">
                Contest Ends In
              </p>
              <CountdownTimer deadline={deadline} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link href="/ledger-contest/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Enter Contest
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/ledger-contest/leaderboard">
                <Button size="lg" variant="outline">
                  View Leaderboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prize Pool Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Rewards
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Prize Pool
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {prizePool.map((prize, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-8 rounded-xl border border-blue-200 dark:border-blue-800 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{prize.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{prize.rank}</h3>
                <p className="text-3xl font-bold text-blue-600">{prize.prize}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
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
              Getting Started
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-950 p-8 rounded-xl border border-gray-200 dark:border-gray-800 h-full">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <a href={step.link} target={step.link.startsWith('http') ? '_blank' : undefined} rel={step.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <Button variant="outline" size="sm" className="w-full">
                      {step.cta}
                    </Button>
                  </a>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300 dark:bg-blue-700" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="text-center"
            >
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">
                Participants
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">1,250+</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={1}
              className="text-center"
            >
              <Gift className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">
                Total Prizes
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">₦360K+</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={2}
              className="text-center"
            >
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">
                Referrals
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">5K+</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Compete?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Sign up now, get your referral link, and start inviting friends to climb the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ledger-contest/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Inviting
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/ledger-contest/leaderboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}