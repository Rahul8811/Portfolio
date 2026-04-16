"use client";

import { useEffect, useState } from 'react';
import { assets } from '@/constant/assets';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';
import { IoMdOpen } from 'react-icons/io';
import { FiFigma } from 'react-icons/fi';
import styles from "./home.module.css";

// ─── Resolve local image key → asset (keeps all existing local images working) ─
const projectImageMap: Record<string, any> = {
    gym: assets.home.myLatestProject.projects.gym,
    runner: assets.home.myLatestProject.projects.runner,
    ice: assets.home.myLatestProject.projects.ice,
    food: assets.home.myLatestProject.projects.food,
    trad: assets.home.myLatestProject.projects.trad,
    bot: assets.home.myLatestProject.projects.bot,
    car: assets.home.myLatestProject.projects.car,
};

function resolveImage(imageKey: string, imageUrl: string) {
    if (imageUrl) return imageUrl; // external URL takes priority
    return projectImageMap[imageKey] ?? assets.home.myLatestProject.projects.gym;
}

// ─── Tab button images ────────────────────────────────────────────────────────
const tabMeta: Record<string, any> = {
    Project: assets.home.myLatestProject.suitcase,
    Design: assets.home.myLatestProject.figma,
};

export default function SectionMyLatestProject() {
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);

    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    // ── Load data from CMS JSON ───────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/data')
            .then((r) => r.json())
            .then((data) => {
                const tabOrder = ['Project', 'Design'];
                const built = tabOrder.map((tabName) => ({
                    name: tabName,
                    image: tabMeta[tabName],
                    data: (data.projects as any[])
                        .filter((p) => p.tab === tabName)
                        .map((p) => ({
                            slug: p.slug,
                            title: p.title,
                            image: resolveImage(p.imageKey, p.imageUrl),
                            repositoryUrl: p.repositoryUrl,
                            demoUrl: p.demoUrl,
                            tab: p.tab,
                        })),
                }));

                // "All" tab = every project + design combined
                const allItems = (data.projects as any[]).map((p) => ({
                    slug: p.slug,
                    title: p.title,
                    image: resolveImage(p.imageKey, p.imageUrl),
                    repositoryUrl: p.repositoryUrl,
                    demoUrl: p.demoUrl,
                    tab: p.tab,
                }));

                built.push({
                    name: 'All',
                    image: assets.home.myLatestProject.rocket,
                    data: allItems,
                });
                setTabs(built);
                setLoaded(true);
            })
            .catch(() => {
                setTabs([]);
                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && parseInt(tab) < tabs.length - 1) {
            setActiveTab(parseInt(tab));
        }
    }, [activeTab, tabs.length]);

    if (!loaded) return null; // wait for data before rendering

    return (
        <section ref={ref} className={`safe-x-padding ${styles.sectionDistance}`} aria-label='My Latest Project Section'>
            <div className='text-center'>
                <motion.h2 initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5 }} className={`${styles.sectionTitle} pb-8`}>My Latest Project</motion.h2>
                <motion.p initial={{ y: 100, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.7 }} className={`${styles.sectionDescription} max-w-[706px] mx-auto`}>Take a look at something I&apos;ve worked on, such as a case study, real project, and more</motion.p>
            </div>
            <div className='mt-[50px] h-full'>
                <div className='flex flex-col items-center justify-center md:items-start md:flex-row gap-9'>
                    <div className='flex flex-row md:flex-col bg-gray p-3 md:p-[26px] rounded-2xl md:rounded-[25px] gap-x-3 md:gap-x-0 gap-y-[26px]'>
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={index.toString()}
                                className={`relative ${activeTab === index ? 'gradient-bg' : 'bg-white'} w-[75px] h-[75px] md:w-[150px] md:h-[150px] rounded-2xl md:rounded-[25px] flex justify-center items-center shadow-xl overflow-hidden`}
                                initial={{ opacity: 0, y: 50 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                onClick={() => {
                                    setActiveTab(index);
                                    window.history.pushState({}, '', `?tab=${index}`);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image src={tab.image} alt="" width={100} height={100} style={{ height: 'auto' }} />
                                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full transition-opacity duration-300 opacity-0 bg-gray/10 backdrop-blur-sm rounded-2xl md:rounded-[25px] hover:opacity-100 md:text-2xl">
                                    <p className={`${activeTab === index ? 'text-white' : 'text-accent'} font-bold transition-colors duration-75 ease-in-out`}>{tab.name}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                    <div className='overflow-hidden'>
                        <div className='bg-gray rounded-[36px] p-[26px] w-full h-[600px] overflow-y-auto'>
                            <div className='grid grid-flow-row grid-cols-12 gap-[26px]'>
                                {tabs.map((tab, tabIndex) =>
                                    tab.data.map((item: any, dataIndex: number) =>
                                        activeTab === tabIndex && (
                                            <motion.div
                                                key={dataIndex.toString()}
                                                className="relative col-span-12 overflow-hidden group xl:col-span-6"
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.5 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="col-span-6">
                                                    <motion.div
                                                        className="bg-white p-[26px] rounded-2xl md:rounded-[25px] h-[261px] overflow-hidden"
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                                        transition={{ duration: 0.5, delay: 0.2 + dataIndex * 0.1 }}
                                                    >
                                                        <Image
                                                            className="object-contain w-full h-auto"
                                                            src={item.image}
                                                            alt=""
                                                            width={441}
                                                            height={261}
                                                            priority
                                                        />
                                                    </motion.div>
                                                </div>
                                                <div className='absolute top-0 bottom-0 left-0 right-0 hidden transition-all duration-300 gap-y-2 group-hover:block bg-gray/10 backdrop-blur-sm rounded-2xl'>
                                                    <div className='flex flex-col items-center justify-center w-full h-full select-none lg:select-auto'>
                                                        <p className="p-8 text-xl font-bold text-center transition-all duration-150 ease-in-out line-clamp-1">{item.title}</p>
                                                        <div className='flex flex-row gap-4 text-3xl'>
                                                            {item.repositoryUrl && (
                                                                <Link
                                                                    className="p-4 transition-all duration-150 ease-in-out bg-gray rounded-2xl hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
                                                                    href={{ pathname: item.repositoryUrl, query: { utm_source: 'rahul.my.id', utm_medium: 'campaign', utm_campaign: 'portfolio' } }}
                                                                    target='_blank'
                                                                    title="Repository"
                                                                >
                                                                    {tabs[activeTab].name.toLowerCase() === "project" ? <BsGithub /> : <FiFigma />}
                                                                </Link>
                                                            )}
                                                            {item.demoUrl && (
                                                                <Link
                                                                    className="p-4 transition-all duration-300 ease-in-out bg-gray rounded-2xl hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
                                                                    href={{ pathname: item.demoUrl, query: { utm_source: 'rahul.my.id', utm_medium: 'campaign', utm_campaign: 'portfolio' } }}
                                                                    target='_blank'
                                                                    title="Demo"
                                                                >
                                                                    <IoMdOpen />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
