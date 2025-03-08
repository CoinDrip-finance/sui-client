import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

import { classNames } from '../utils/presentation';

export interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedItem: DropdownItem;
  onChange: (selectedItem: DropdownItem) => void;
}

export default function Dropdown({ items, selectedItem, onChange }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center text-sm font-medium text-white">
          {selectedItem.label}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-4 z-10 mt-2 w-56 origin-top-right rounded-lg bg-neutral-800 shadow-lg focus:outline-none">
          <div className="py-1">
            {items.map((item) => (
              <Menu.Item key={item.id}>
                {({ active }) => (
                  <span
                    onClick={() => onChange(item)}
                    className={classNames(
                      active ? "text-white" : "text-neutral-400",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
