"use client";

import { assets } from '@/constant/assets'
import Image from 'next/image'
import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import styles from "./home.module.css";

const techImageMap: Record<string, any> = {
    Python: assets.home.technologyStack.Python,
    cplus: assets.home.technologyStack.cplus,
    blender: assets.home.technologyStack.blender,
    ue: assets.home.technologyStack.ue,
    Figma: assets.home.technologyStack.Figma,
    sd: assets.home.technologyStack.sd,
    Filmora: assets.home.technologyStack.Filmora,
    HTML: assets.home.technologyStack.HTML,
    css: assets.home.technologyStack.css,
};

interface TechItem {
    id: string;
    name: string;
    imageKey: string;
    imageUrl: string;
    officialSite: string;
}

interface Props {
    technologies: TechItem[];
}

export default function SectionTechnologyStack({ technologies }: Props) {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section ref={ref} className={`safe-x-padding ${styles.sectionDistance}`}>
            <div className='text-center'>
                <motion.h2 initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5 }} className={`${styles.sectionTitle} pb-8`}>Technology Stack</motion.h2>
                <motion.p initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.7 }} className={`${styles.sectionDescription}  max-w-[960px] mx-auto`}>I am concerned about Design and performance for my client. That&apos;s why I always keep updating and use best technologies in a Product</motion.p>
            </div>
            <div className='flex items-center justify-center mt-12'>
                <div className='flex flex-row gap-[50px] max-w-[864px] flex-wrap justify-center items-center'>
                    {technologies.map((item, index) => (
                        <div key={item.id} className='relative h-full'>
                            <motion.div
                                className="flex justify-center items-center w-[100px] h-[100px] transition-all duration-150 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.imageUrl ? (
                                    <Image className='w-auto h-[100px]' src={item.imageUrl} width={0} height={100} alt={item.name} />
                                ) : techImageMap[item.imageKey] ? (
                                    <Image className='w-auto h-[100px]' src={techImageMap[item.imageKey]} width={0} height={100} alt={item.name} />
                                ) : (
                                    <div className="w-[80px] h-[80px] rounded-2xl bg-gray flex items-center justify-center text-accent2 text-xs font-bold text-center p-2">{item.name}</div>
                                )}
                                <Link
                                    href={{ pathname: item.officialSite, query: { utm_source: 'rahul.my.id', utm_medium: 'campaign', utm_campaign: 'portfolio' } }}
                                    target="_blank"
                                    title={`Figure out about ${item.name}`}
                                >
                                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full p-1 text-white transition-all duration-300 bg-opacity-50 opacity-0 gradient-bg hover:opacity-100 rounded-xl">
                                        <p className='font-semibold text-center line-clamp-3'>{item.name}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
