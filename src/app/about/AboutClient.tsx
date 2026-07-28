"use client";

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function AboutClient() {
  const whatWeDo = [
    {
      name: 'Education',
      description: 'Blockchain fundamentals, smart contract development, DeFi concepts, and Web3 tooling - taught in sessions that assume you\'re sharp, not that you\'re lost. Workshops, study groups, and technical seminars run by people who are learning right alongside you.',
    },
    {
      name: 'Community Building',
      description: 'FBC is not a LinkedIn badge. It\'s a group chat that actually helps, study sessions that run late, and a network of people who will pull you into an opportunity before they think of themselves. We build the environment deliberately because it doesn\'t happen by accident.',
    },
    {
      name: 'Opportunities',
      description: 'Hackathons, bounty programs, referral contests, and on-chain challenges with real prizes and real recognition. We don\'t just teach Web3 - we put you inside it.',
    },
    {
      name: 'Advocacy',
      description: 'FBC carries the blockchain conversation beyond our walls - across the university, across Owerri, and into the wider Nigerian tech community. More people understanding this technology means more builders, more users, and a bigger ecosystem for all of us.',
    },
  ];

  const values = [
    {
      name: 'Curiosity',
      description: 'We ask questions before we assume. Every new protocol, tool, or concept is worth understanding on its own terms. The best builders in our community are the ones who never stopped being genuinely curious.',
    },
    {
      name: 'Community',
      description: 'We move as a unit. Your win is a proof of concept for everyone here. We share knowledge freely, show up for each other\'s projects, and measure our success collectively, not just individually.',
    },
    {
      name: 'Excellence',
      description: 'We hold our work to a high bar - not because we\'re competing, but because the space demands it. Sloppy code, half-finished ideas, and uncommitted effort don\'t make it on-chain. Neither do they make it out of FBC.',
    },
    {
      name: 'Accessibility',
      description: 'Your department, your level, your background - none of it is a barrier here. If you\'re willing to learn and willing to contribute, there\'s a place for you. Blockchain is too important to gatekeep.',
    },
    {
      name: 'Integrity',
      description: 'We say what we mean, ship what we promise, and operate openly. In an industry that has had more than its share of bad actors, FBC is intentional about being trustworthy - in how we run the club, handle prizes, and represent our members.',
    },
    {
      name: 'Ownership',
      description: 'We don\'t wait for permission. FBC members take initiative, run with ideas, and treat the club like something they built - because they did. Every event, bounty, and campaign here was started by someone who decided to make it happen.',
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
            className="text-center"
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              About FBC
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              We&apos;re building the generation that builds on-chain.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              FUTO Blockchain Club is a student-led Web3 community at the Federal University of Technology, Owerri. We started because we saw the gap - brilliant students at one of Nigeria&apos;s top engineering schools with no structured path into blockchain. So we built one ourselves. Today FBC is where builders learn, collaborate, ship, and win - together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-6">
              Our Vision
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              Nigerian builders at the frontier of the decentralized web.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              We believe the next wave of blockchain innovation won&apos;t just come from San Francisco or Singapore. It will come from campuses like ours - from students who grew up understanding what it means to need better financial infrastructure, better access, better tools. FBC exists to make sure those students are ready when the moment arrives, and that they help create the moment themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-6 text-center">
              Our Mission
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              To give every student at FUTO a real, practical path into Web3 - through education that doesn&apos;t talk down to you, a community that pushes you forward, and opportunities that reward you for building.
            </h2>

            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-8 text-center">
              What We Do
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whatWeDo.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Core Values
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              What we stand for
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{value.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}