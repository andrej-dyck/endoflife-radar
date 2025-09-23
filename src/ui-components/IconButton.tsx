import React from 'react'

export const IconButton = ({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) =>
  <button type="button"
    onClick={() => onClick?.()}
    className="size-6 rounded-full transition-all p-1 hover:text-focus focus:text-focus hover:ring hover:ring-focus focus:ring focus:ring-focus cursor-pointer"
  >
    {icon}
  </button>
