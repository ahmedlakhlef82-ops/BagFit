'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plane, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center space-y-4 max-w-2xl"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Travel Without Surprises
        </h1>
        <p className="text-xl text-muted-foreground">
          Your ultimate airline baggage allowance platform. Manage your luggage
          dimensions, check airline rules, and travel with confidence.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Check Allowances
              </CardTitle>
              <CardDescription className="text-base">
                Find baggage rules for over 500+ airlines worldwide in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full transition-transform active:scale-95">
                <Link href="/airlines">Search Airlines</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Measure Luggage</CardTitle>
              <CardDescription className="text-base">
                Input your bag dimensions to instantly see if it fits as a
                carry-on or checked bag.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full transition-transform active:scale-95 border-primary/20 hover:border-primary/50"
              >
                <Link href="/measure">Measure Now</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-1"
        >
          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription className="text-base">
                Save your frequent airlines and luggage dimensions for quick
                access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full transition-transform active:scale-95"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
