"use client";

import React from 'react'
import { GrFormClose } from 'react-icons/gr'

export default function Banner({ openToWork }: { openToWork: boolean }) {
    const [dismissed, setDismissed] = React.useState(false)

    if (!openToWork || dismissed) return null;

    return (
        <div className="relative gradient-bg">
            <div className='flex flex-row items-center justify-center safe-x-padding'>
                <div className='flex items-center justify-center flex-1 py-2.5 gap-2.5'>
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                    <p className='text-white text-sm font-semibold text-center'>
                        Open to Work — Available for Game Design &amp; UI/UX projects
                    </p>
                </div>
                <button
                    className='p-1 text-white/70 hover:text-white transition-colors text-xl shrink-0'
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                >
                    <GrFormClose />
                </button>
            </div>
        </div>
    )
}
