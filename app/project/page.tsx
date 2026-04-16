"use client";

import { assets } from "@/constant/assets";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsDribbble, BsGithub } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { useInView } from "react-intersection-observer";

// ── Resolve local image key → asset (same map as home page) ──────────────────
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
    if (imageUrl) return imageUrl;
    return projectImageMap[imageKey] ?? assets.home.myLatestProject.projects.gym;
}

// ── Merge CMS data with hardcoded rich details (summary, techStacks) ──────────
// This lets existing projects keep their descriptions while new ones still appear
const richDetails: Record<string, { summary: string; techStacks: { name: string; imageUrl: string; webUrl: string }[] }> = {
    'Open-World-gym': {
        summary: '"Explore a vast, dynamic gym environment in Unreal Engine, offering diverse workouts interactive fitness equipment."',
        techStacks: [
            { name: 'Unreal Engine', imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png', webUrl: 'https://www.unrealengine.com/' },
            { name: 'Blender', imageUrl: 'https://img.icons8.com/color/48/3ds-max.png', webUrl: 'https://www.blender.org/' },
        ],
    },
    'Endless-runner': {
        summary: 'A fast-paced endless runner built in Unreal Engine with smooth animations and procedurally generated obstacles.',
        techStacks: [
            { name: 'Unreal Engine', imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png', webUrl: 'https://www.unrealengine.com/' },
            { name: '3ds-Max', imageUrl: 'https://img.icons8.com/color/48/3ds-max.png', webUrl: 'https://www.autodesk.in/products/3ds-max/overview' },
        ],
    },
    'Drone-fight': {
        summary: '"Optimized Unreal Engine project with streamlined blueprints for precise line tracing and hit detection. Efficient, modular, and performance-focused"',
        techStacks: [
            { name: 'Unreal Engine', imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png', webUrl: 'https://www.unrealengine.com/' },
            { name: '3ds-Max', imageUrl: 'https://img.icons8.com/color/48/3ds-max.png', webUrl: 'https://www.autodesk.in/products/3ds-max/overview' },
        ],
    },
    'Time-race': {
        summary: 'Race against the clock in this high-speed car racing game built with Unreal Engine.',
        techStacks: [
            { name: 'Unreal Engine', imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png', webUrl: 'https://www.unrealengine.com/' },
            { name: '3d-max', imageUrl: 'https://img.icons8.com/color/48/3ds-max.png', webUrl: 'https://www.autodesk.in/products/3ds-max/overview' },
        ],
    },
    'Ice cream': {
        summary: 'Ice Cream Parlour design in Figma: Immersive, intuitive, and visually captivating.',
        techStacks: [{ name: 'Figma', imageUrl: 'https://img.icons8.com/color/48/figma--v1.png', webUrl: 'https://www.figma.com/' }],
    },
    'Food Stall': {
        summary: 'Food Stall design in Figma: Immersive, intuitive, and visually captivating.',
        techStacks: [{ name: 'Figma', imageUrl: 'https://img.icons8.com/color/48/figma--v1.png', webUrl: 'https://www.figma.com/' }],
    },
    'Trad': {
        summary: 'Indian Culture design in Figma: Immersive, intuitive, and visually captivating, page dedicated to the culture and tradition of India.',
        techStacks: [{ name: 'Figma', imageUrl: 'https://img.icons8.com/color/48/figma--v1.png', webUrl: 'https://www.figma.com/' }],
    },
};

export default function Project() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);

    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        fetch('/api/admin/data')
            .then((r) => r.json())
            .then((data) => {
                const built = (data.projects as any[]).map((p) => {
                    const details = richDetails[p.slug] ?? { summary: '', techStacks: [] };
                    return {
                        slug: p.slug,
                        title: p.title,
                        image: resolveImage(p.imageKey, p.imageUrl),
                        repositoryUrl: p.repositoryUrl,
                        demoUrl: p.demoUrl,
                        summary: details.summary,
                        techStacks: details.techStacks,
                        isDesign: p.tab === 'Design',
                    };
                });
                setProjects(built);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, []);

    return (
        <section ref={ref} className='safe-x-padding mt-[38px] overflow-y-hidden lg:min-h-[1000px]'>
            <div className='text-center'>
                <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.2 }} className='mb-6 text-5xl font-extrabold lg:text-6xl font-montserrat gradient-text'>Explore Rahul&apos;s Project</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className='font-medium text-xl lg:text-2xl text-accent max-w-[730px] mx-auto'>Take a look at something I&apos;ve worked on, such as Design, real project, and more.</motion.p>
            </div>
            <div className='my-[50px] h-full'>
                {!loaded ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="grid grid-flow-row grid-cols-4 gap-6 md:grid-cols-8 xl:grid-cols-12">
                        {projects.map((project, index) => (
                            <div key={index} className="col-span-4 shadow-md hover:shadow-2xl hover:scale-[1.01] rounded-2xl transition-all duration-500 ease-in-out">
                                <Link className="w-full h-full bg-white" href={project.demoUrl || '#'} target="_blank">
                                    <div className="relative overflow-hidden max-h-48 rounded-tl-2xl rounded-tr-2xl">
                                        <div className="relative">
                                            <Image
                                                className="object-cover w-full"
                                                src={project.image}
                                                alt={`${project.title} thumbnail`}
                                                width={441}
                                                height={261}
                                                unoptimized={typeof project.image === 'string'}
                                            />
                                            <div className="absolute top-0 right-0 p-2 bg-black z-[1] text-white rounded-bl-2xl text-sm hover:opacity-0 transition-all duration-500 ease-in-out">
                                                {project.isDesign ? 'Design' : 'Real Project'}
                                            </div>
                                        </div>
                                        {project.techStacks.length > 0 && (
                                            <div className="absolute bottom-0 left-0 px-6 py-3">
                                                <div className="flex flex-row flex-wrap gap-x-4">
                                                    {project.techStacks.map((techStack: any, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0 }}
                                                            animate={inView ? { opacity: 1 } : {}}
                                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                            className="p-1 bg-white border-[0.5px] border-gray/70 rounded-full hover:cursor-help"
                                                        >
                                                            <Image src={techStack.imageUrl} alt={`${techStack.name} icon`} loader={({ src }) => src} width={36} height={36} title={techStack.name} unoptimized />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 py-4">
                                        <h5 className="mb-2 text-base font-bold line-clamp-1">{project.title}</h5>
                                        <p className="text-sm font-normal line-clamp-2">{project.summary || 'No description yet.'}</p>
                                        <div className="grid grid-flow-col gap-4 mt-4">
                                            {project.demoUrl && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); window.open(project.demoUrl, '_blank'); }}
                                                    className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform rounded-lg shadow-lg bg-accent hover:gradient-bg line-clamp-1"
                                                >
                                                    <span>{project.isDesign ? 'See Prototype' : 'Visit Demo'}</span>
                                                    <IoMdOpen />
                                                </button>
                                            )}
                                            {project.repositoryUrl && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); window.open(project.repositoryUrl, '_blank'); }}
                                                    className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform rounded-lg shadow-lg bg-accent hover:gradient-bg line-clamp-1"
                                                >
                                                    {project.isDesign ? (
                                                        <><span>Dribbble</span><BsDribbble /></>
                                                    ) : (
                                                        <><span>Github</span><BsGithub /></>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
