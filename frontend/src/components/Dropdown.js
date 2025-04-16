import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="dropdown w-full"
      onToggle={(e) => setIsOpen(e.target.open)}
    >
      <summary className="btn m-1 w-full flex justify-between items-center">
        폴더 선택
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4 ml-2" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        )}
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-full p-2 shadow">
        <li>
          <a>test1</a>
        </li>
        <li>
          <a>test2</a>
        </li>
        <li>
          <a>test3</a>
        </li>
      </ul>
    </details>
  );
};

export default Dropdown;
