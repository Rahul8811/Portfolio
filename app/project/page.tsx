"use client";

import { assets } from "@/constant/assets";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsDribbble, BsGithub } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { FaGithub } from "react-icons/fa";

const categories = [
    {
        slug: 'app',
        name: 'App',
    },
    {
        slug: 'design',
        name: 'Design',
    }
];

const projectTypes = [
    {
        slug: 'design',
        name: 'Design',
    },
    {
        slug: 'real-project',
        name: 'Real Project',
    }
]

const initialProjects = [
    {
        slug: 'Open-World-gym',
        title: 'Open World Gym - Seige',
        image: assets.home.myLatestProject.projects.gym,
        repositoryUrl: "https://github.com/Rahul8811/Open-World-Gym",
        demoUrl: "https://rahul90.itch.io/open-world-gym",
        summary: '"Explore a vast, dynamic gym environment in Unreal Engine, offering diverse workouts interactive fitness equipment."',
        techStacks: [
            {
                name: 'Unreal Engine',
                imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png',
                webUrl: 'https://nextjs.org/'
            },
            {
                name: '3ds-Max',
                imageUrl: 'https://img.icons8.com/color/48/3ds-max.png',
                webUrl: 'https://www.autodesk.in/products/3ds-max/overview?term=1-YEAR&tab=subscription'
            },
          
        ],
        projectType: projectTypes[1],
        category: categories[0]
    },
    {
                slug: 'Endless-runner',
                title: 'Endless runner - Game',
                image: assets.home.myLatestProject.projects.runner,
                repositoryUrl: "https://github.com/Rahul8811/Endless-Runner",
                demoUrl: "https://rahul90.itch.io/the-endless-road",
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
        techStacks: [
            {
                name: 'Unreal Engine',
                imageUrl: 'https://img.icons8.com/ios-filled/50/unreal-engine.png',
                webUrl: 'https://nextjs.org/'
            },
            {
                name: '3ds-Max',
                imageUrl: 'https://img.icons8.com/color/48/3ds-max.png',
                webUrl: 'https://www.autodesk.in/products/3ds-max/overview?term=1-YEAR&tab=subscription'
            },
          
        ],
        projectType: projectTypes[1],
        category: categories[0]
    },
    {
        slug: 'Duniya-Ui/ux',
        title: 'Duniya',
        image: assets.home.myLatestProject.projects.xr_3d,
        repositoryUrl: "https://www.figma.com/file/0BcYD3tqZV1CmLeeiVZHb5/Untitled?type=design&node-id=0-1&mode=design&t=mYD7LqRpvJOECQli-0",
        demoUrl: "https://www.figma.com/file/0BcYD3tqZV1CmLeeiVZHb5/Untitled?type=design&node-id=0-1&mode=design&t=mYD7LqRpvJOECQli-0",
        summary: 'XR interface design in Figma: Immersive, intuitive, and visually captivating; blending virtual and real-world experiences seamlessly for users',
        techStacks: [
            {
                name: 'Figma',
                imageUrl: 'https://img.icons8.com/color/48/figma--v1.png',
                webUrl: 'https://www.figma.com/'
            },
        
        ],
        projectType: projectTypes[0],
        category: categories[1]
    },
    
]

export default function Project() {
    const [projects, setProjects] = useState(initialProjects);
    const [filteredProjects, setFilteredProjects] = useState(initialProjects);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className='safe-x-padding mt-[38px] overflow-y-hidden lg:min-h-[1000px]'>
            <div className='text-center'>
                <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.2 }} className='mb-6 text-5xl font-extrabold lg:text-6xl font-montserrat gradient-text'>Explore Rahul&apos;s Project</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className='font-medium text-xl lg:text-2xl text-accent max-w-[730px] mx-auto'>Take a look at something I&apos;ve worked on, such as Design, real project, and more.</motion.p>
            </div>
            <div className='my-[50px] h-full'>
                <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="grid grid-flow-row grid-cols-4 gap-6 md:grid-cols-8 xl:grid-cols-12">
                    {filteredProjects.map((project, index) => (
                        <div key={index} className="col-span-4 shadow-md hover:shadow-2xl hover:scale-[1.01] rounded-2xl transition-all duration-500 ease-in-out">
                            <Link
                                className="w-full h-full bg-white"
                                href={`/project/${project.slug}`}
                                target="_blank"
                            >
                                <div className="relative overflow-hidden max-h-48 rounded-tl-2xl rounded-tr-2xl">
                                    <div className="relative">
                                        <Image className="object-cover" src={project.image} alt={`${project.title} thumbnail`} />
                                        <div className="absolute top-0 right-0 p-2 bg-black z-[1] text-white rounded-bl-2xl text-sm hover:opacity-0 transition-all duration-500 ease-in-out">
                                            {project.projectType.name}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 px-6 py-3">
                                        <div className="flex flex-row flex-wrap gap-x-4">
                                            {project.techStacks.map((techStack, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={inView ? { opacity: 1 } : {}}
                                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                    className="p-1 bg-white border-[0.5px] border-gray/70 rounded-full hover:cursor-help"
                                                >
                                                    <Image
                                                        src={techStack.imageUrl}
                                                        alt={`${techStack.name} icon`}
                                                        loader={({ src }) => src}
                                                        width={36}
                                                        height={36}
                                                        title={techStack.name}
                                                        unoptimized
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 py-4">
                                    <h5 className="mb-2 text-base font-bold line-clamp-1">{project.title}</h5>
                                    <p className="text-sm font-normal line-clamp-2">{project.summary}</p>
                                    <div className="grid grid-flow-col gap-4 mt-4">
                                        {project.demoUrl && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(project.demoUrl, '_blank', 'utm_source=deri.my.id&utm_medium=campaign&utm_campaign=portfolio');
                                                }}
                                                className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform rounded-lg shadow-lg bg-accent hover:gradient-bg line-clamp-1">
                                                <span>
                                                    {project.category.slug === 'design' ?
                                                        "See Prototype"
                                                        :
                                                        "Visit Demo"
                                                    }
                                                </span>
                                                <IoMdOpen />
                                            </button>
                                        )}

                                        {project.repositoryUrl && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(project.repositoryUrl, '_blank', 'utm_source=deri.my.id&utm_medium=campaign&utm_campaign=portfolio');
                                                }}
                                                rel="noopener noreferrer"
                                                className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform rounded-lg shadow-lg bg-accent hover:gradient-bg line-clamp-1"
                                            >
                                                {project.category.slug === 'design' ? (
                                                    <>
                                                        <span>Dribble</span>
                                                        <BsDribbble />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Github</span>
                                                        <BsGithub />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>

    )
}