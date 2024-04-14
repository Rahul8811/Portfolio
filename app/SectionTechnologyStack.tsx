"use client";

import { assets } from '@/constant/assets'
import Image from 'next/image'
import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import styles from "./home.module.css";


const technologyStack = [
    {
        name: 'Python',
        image: assets.home.technologyStack.Python,
        officialSite: 'https://www.python.org/',
    },
    {
        name: 'C++',
        image: assets.home.technologyStack.cplus,
        officialSite: 'https://cplusplus.com/',
    },
    {
        name: '3dsMax',
        image: assets.home.technologyStack.threedsMax,
        officialSite: 'https://www.autodesk.in/products/3ds-max/overview?term=1-YEAR&tab=subscription',
    },
    {
        name: 'Unreal engine',
        image: assets.home.technologyStack.ue,
        officialSite: 'https://www.unrealengine.com/en-US?sessionInvalidated=true',
    },
    {
        name: "Figma",
        image: assets.home.technologyStack.Figma,
        officialSite: 'https://www.figma.com/',
    },
    {
        name: "Shaper 3D",
        image: assets.home.technologyStack.sd,
        officialSite: 'https://www.shapr3d.com/',
    },
    {
        name: "Filmora",
        image: assets.home.technologyStack.Filmora,
        officialSite: 'Filmora',
    },
    {
        name: "HTML",
        image: assets.home.technologyStack.HTML,
        officialSite: 'https://html.com/',
    },
    {
        name: "CSS",
        image: assets.home.technologyStack.css,
        officialSite: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    },
  
]

export default function SectionTechnologyStack() {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className={`safe-x-padding ${styles.sectionDistance}`}>
            <div className='text-center'>
                <motion.h2 initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5 }} className={`${styles.sectionTitle} pb-8`}>Technology Stack</motion.h2>
                <motion.p initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.7 }} className={`${styles.sectionDescription}  max-w-[960px] mx-auto`}>I are concerned about security and performance for my client. That&apos;s why I always keep updating and use best technologies in a product</motion.p>
            </div>
            <div className='flex items-center justify-center mt-12'>
                <div className='flex flex-row gap-[50px] max-w-[864px] flex-wrap justify-center items-center'>
                    {technologyStack.map((item, index) => (
                        <div key={index.toString()} className='relative h-full'>
                            <motion.div
                                className="flex justify-center items-center w-[100px] h-[100px] transition-all duration-150 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image
                                    className='w-auto h-[100px]'
                                    src={item.image}
                                    width={0}
                                    height={100}
                                    alt={item.name}
                                />
                                <Link
                                    href={{
                                        pathname: item.officialSite,
                                        query: {
                                            utm_source: 'deri.my.id',
                                            utm_medium: 'campaign',
                                            utm_campaign: 'portfolio'
                                        }
                                    }}
                                    target="_blank"
                                    title={`Figure out about ${item.name}`}
                                >
                                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full p-1 text-white transition-all duration-300 bg-opacity-50 opacity-0 gradient-bg hover:opacity-100 rounded-xl">
                                        <p className='font-semibold text-center line-clamp-3'>
                                            {item.name}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div >
        </section >
    )
}
