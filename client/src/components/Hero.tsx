"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { buttonVariants } from "./ui/button";
import { TextEffect } from "./ui/text-effect";
import { TextLoop } from "./ui/text-loop";

const VARIANTS = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export function Hero() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleStartTrading = () => {
    if (isConnected) {
      router.push("/swaps");
    } else {
      alert("Please connect your wallet to start trading.");
    }
  };

  return (
    <div className="relative isolate py-32 sm:py-48 lg:py-56 ">
      <div className="mx-auto max-w-2xl ">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center ">
          <motion.div
            className="relative rounded-full px-3 py-1 text-sm/6 text-zinc-600 ring-1 ring-zinc-900/10 hover:ring-zinc-900/20 dark:text-zinc-300 dark:ring-1 dark:ring-zinc-100/20 dark:hover:ring-zinc-100/20"
            variants={VARIANTS}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: "easeOut",
            }}
          >
            Unlock seamless DeFi trading and liquidity solutions.{" "}
            <a
              href="#"
              className="inline-flex items-center gap-1 font-semibold text-zinc-600  dark:text-foreground"
            >
              <span className="absolute inset-0" aria-hidden="true"></span>
              Learn more <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
        <div className="text-center">
          <div className="flex flex-col md:flex-row items-center md:justify-center">
            <TextEffect
              className="text-balance text-5xl tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl font-semibold"
              preset="fade-in-blur"
              as="h1"
              per="char"
              speedReveal={4}
              segmentTransition={{ duration: 0.5, ease: "easeOut" }}
              delay={0}
            >
              DeFi is the Future
            </TextEffect>
          </div>

          <TextEffect
            className="mt-8 text-pretty text-lg text-zinc-500 dark:text-zinc-300 sm:text-lg/8"
            preset="blur"
            as="p"
            per="line"
            delay={0.5}
            speedReveal={0.8}
            segmentTransition={{ duration: 0.5, ease: "easeOut" }}
          >
            {`
  WaveDeFi offers high-speed swaps, deep liquidity, and transparent decentralized finance solutions.`}
          </TextEffect>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <motion.span
              className={buttonVariants({ variant: "wave" })}
              variants={VARIANTS}
              initial="hidden"
              animate="visible"
              onClick={handleStartTrading}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              Start trading
            </motion.span>
            {/* </Link> */}
            <Link href="/liquidity/pool" passHref>
              <motion.span
                className="inline-flex items-center gap-1 text-sm/6 font-semibold text-zinc-900 dark:text-zinc-200"
                variants={VARIANTS}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                  ease: "easeOut",
                }}
              >
                Explore Liquidity Pools <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
