import React from 'react'

export const IconButton = ({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) =>
  <button
    onClick={() => onClick?.()}
    className="size-6 cursor-pointer rounded-full p-1 transition-all hover:text-focus hover:ring hover:ring-focus focus:text-focus focus:ring focus:ring-focus"
  >
    {icon}
  </button>
