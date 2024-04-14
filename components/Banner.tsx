import React from 'react'
import { GrFormClose } from 'react-icons/gr'

export default function Banner() {
    const [isBannerOpen, setIsBannerOpen] = React.useState<boolean>(true)

    return (
        <>
            {isBannerOpen && (
                <div className="relative bg-gray">
                    <div className='flex flex-row items-center justify-center'>
                        <div className='flex items-center justify-center flex-1 p-4'>
                            <p className='text-center'> Hi Rahul This Side.</p>
                        </div>
                        <button className='p-2 mr-5 text-2xl md:p-4' onClick={() => setIsBannerOpen(false)}>
                            <GrFormClose />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
