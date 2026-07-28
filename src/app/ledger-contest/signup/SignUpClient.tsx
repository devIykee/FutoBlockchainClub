"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { LEVELS, NICHES, SKILL_LEVELS } from "@/lib/constants";
import { SOCIAL_LINKS } from "@/lib/socials";
import {
  clearSocialVerify,
  readSocialVerify,
  writeSocialVerify,
  type SocialKey,
} from "@/lib/social-verify-storage";
import { readStoredRef } from "@/components/RefCapture";
import Link from "next/link";

export function SignUpClient() {
  const [step, setStep] = useState<'prerequisites' | 'form' | 'success'>('prerequisites');
  const [clicked, setClicked] = useState<Record<SocialKey, boolean>>({
    ledger: false,
    fbc: false,
    x: false,
  });
  const [checked, setChecked] = useState<Record<SocialKey, boolean>>({
    ledger: false,
    fbc: false,
    x: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    level: '',
    niche: '',
    skillLevel: '',
    xHandle: '',
    telegramUsername: '',
  });

  useEffect(() => {
    setReferredBy(readStoredRef());
    const saved = readSocialVerify();
    setClicked(saved.clicked);
    setChecked({
      ledger: saved.clicked.ledger && saved.checked.ledger,
      fbc: saved.clicked.fbc && saved.checked.fbc,
      x: saved.clicked.x && saved.checked.x,
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeSocialVerify({ clicked, checked });
  }, [clicked, checked, hydrated]);

  const allPrerequisitesMet = checked.ledger && checked.fbc && checked.x;

  function openSocial(key: SocialKey, href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
    setClicked((c) => ({ ...c, [key]: true }));
  }

  function onCheck(key: SocialKey, value: boolean) {
    if (!clicked[key]) return;
    setChecked((c) => ({ ...c, [key]: value }));
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allPrerequisitesMet || submitting) return;
    setError(null);

    const payload = {
      full_name: formData.fullName.trim(),
      department: formData.department.trim(),
      level: formData.level,
      niche: formData.niche,
      skill_level: formData.skillLevel,
      x_handle: formData.xHandle.trim().replace(/^@/, ""),
      telegram_username: formData.telegramUsername.trim().replace(/^@/, ""),
      referred_by: referredBy || null,
      joined_ledger: checked.ledger,
      joined_fbc: checked.fbc,
      followed_x: checked.x,
    };

    if (!payload.full_name || !payload.department || !payload.level || !payload.niche || !payload.skill_level || !payload.x_handle || !payload.telegram_username) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      clearSocialVerify();
      setRefCode(data.ref_code);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const liveUrl = useMemo(() => {
    if (typeof window === "undefined" || !refCode) return "";
    return `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`;
  }, [refCode]);

  const shareText = useMemo(() => {
    if (!liveUrl) return "";
    return encodeURIComponent(
      `I just joined the FBC Ledger Invite Contest. Sign up with my link and climb the leaderboard: ${liveUrl}`
    );
  }, [liveUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(liveUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = liveUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Referral link copied!');
  }

  const handleShareOnX = () => {
    if (!shareText) return;
    const url = `https://twitter.com/intent/tweet?text=${shareText}`;
    window.open(url, '_blank');
  };

  const socialItems = [
    { key: 'ledger' as SocialKey, title: 'Join Ledger Community on Telegram', link: SOCIAL_LINKS.ledgerTelegram },
    { key: 'fbc' as SocialKey, title: 'Join FBC on Telegram', link: SOCIAL_LINKS.fbcTelegram },
    { key: 'x' as SocialKey, title: 'Follow FBC on X', link: SOCIAL_LINKS.fbcX },
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
              Contest
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {step === 'success' ? "You're In!" : 'Sign Up'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              {step === 'success'
                ? 'Your referral link is ready. Share it with friends and climb the leaderboard!'
                : 'Complete the prerequisites and register to get your referral link.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container max-w-4xl">
          {step === 'prerequisites' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Step 1: Prerequisites</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Complete these steps before you can register for the contest.
                </p>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {Object.values(checked).filter(Boolean).length}/3
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${(Object.values(checked).filter(Boolean).length / 3) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Prerequisites List */}
                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {socialItems.map((prereq, i) => (
                    <motion.div
                      key={prereq.key}
                      variants={fadeInUp}
                      custom={i}
                      className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={checked[prereq.key]}
                          onCheckedChange={(val) => onCheck(prereq.key, val === true)}
                          className="w-6 h-6"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{prereq.title}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSocial(prereq.key, prereq.link)}
                      >
                        Open
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Unlock Form Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: allPrerequisitesMet ? 1 : 0.5, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-12"
                >
                  <Button
                    onClick={() => setStep('form')}
                    disabled={!allPrerequisitesMet}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    Continue to Registration
                  </Button>
                  {!allPrerequisitesMet && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                      Complete all prerequisites to unlock registration
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Step 2: Registration</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Fill in your details to complete registration.</p>

              {referredBy && (
                <div className="mb-6 rounded-btn border border-cyan/25 bg-cyan/10 px-4 py-3 text-sm text-ink">
                  Referred by: <span className="font-semibold text-cyan">@{referredBy}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Chioma Okafor"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Department *
                  </label>
                  <Input
                    type="text"
                    placeholder="Computer Science"
                    value={formData.department}
                    onChange={(e) => handleFormChange('department', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Level *
                  </label>
                  <Select value={formData.level} onValueChange={(value) => handleFormChange('level', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>{l} Level</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Niche *
                  </label>
                  <Select value={formData.niche} onValueChange={(value) => handleFormChange('niche', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {NICHES.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Skill Level *
                  </label>
                  <Select value={formData.skillLevel} onValueChange={(value) => handleFormChange('skillLevel', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    X Handle *
                  </label>
                  <Input
                    type="text"
                    placeholder="@yourhandle"
                    value={formData.xHandle}
                    onChange={(e) => handleFormChange('xHandle', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Telegram Username *
                  </label>
                  <Input
                    type="text"
                    placeholder="your_telegram_username"
                    value={formData.telegramUsername}
                    onChange={(e) => handleFormChange('telegramUsername', e.target.value)}
                    required
                  />
                </div>

                {error && <p className="alert-danger">{error}</p>}

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('prerequisites')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {submitting ? 'Submitting…' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'success' && refCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-12">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">You&apos;re All Set!</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Your referral link is ready. Share it with friends and watch your referrals grow. The more you share, the higher you climb on the leaderboard!
                </p>
              </div>

              {/* Referral Link Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-gray-900 text-white p-8 rounded-xl mb-8"
              >
                <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-4">
                  Your Referral Link
                </p>
                <code className="text-lg font-mono break-all mb-6 block">{liveUrl}</code>
                <Button
                  onClick={copyLink}
                  className="bg-white text-gray-900 hover:bg-gray-100 gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Share Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button
                  onClick={handleShareOnX}
                  className="bg-blue-400 hover:bg-blue-500 text-white gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share on X
                </Button>
                <Link href="/ledger-contest/leaderboard">
                  <Button variant="outline">View Leaderboard</Button>
                </Link>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-blue-50 dark:bg-blue-950 p-8 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What&apos;s Next?</h3>
                <ol className="text-left space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Share your referral link with friends on social media</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Each friend who signs up using your link counts as a referral</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Check the leaderboard to see your ranking</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Win prizes based on your final ranking!</span>
                  </li>
                </ol>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}