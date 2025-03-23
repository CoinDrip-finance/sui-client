import { Disclosure, Menu, Transition } from "@headlessui/react";
import { InformationCircleIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";

import ContractAbi from "../../utils/coindrip.abi.json";
import { classNames, getHerotag, getShortAddress } from '../../utils/presentation';
import { authPath, homePath } from "../../utils/routes";
import Logo from "./Logo";
import { ConnectButton } from "@mysten/dapp-kit";

interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  locked?: boolean;
  icon?: any;
}

const navigation: NavigationItem[] = [
  { name: "Vesting", href: "/", current: true, icon: ShieldCheckIcon },
  { name: "Payments", href: "/", locked: true },
  { name: "Airdrops", href: "/", locked: true },
];
const userNavigation: any[] = [];

// const Avatar = ({ user }: { user?: IUser }) => {
//   if (user && user?.imageUrl) {
//     return <img className="h-6 w-6 rounded-full" src={user?.imageUrl} alt="" />;
//   }
//   return <div className="h-6 w-6 rounded-full bg-gradient-to-bl from-primary to-secondary"></div>;
// };

export default function Layout({ children }: any) {
  return (
    <>
      <div className="min-h-full">
        <div className="pb-16 sm:pb-20">
          {/* <div className="relative flex justify-center py-2 bg-gray-300 bg-opacity-10 text-white text-xs z-10">
            <LockClosedIcon className="w-3 mr-1 text-green-300" /> Scam/Phishing verification:{" "}
            <span className="text-green-300 pl-1">https://</span>
            app.coindrip.finance
          </div> */}
          <div className="relative flex justify-center py-2 bg-gray-300 bg-opacity-10 text-white text-xs z-10">
            <InformationCircleIcon className="w-4 mr-1 text-primary" /> Running on <span className="capitalize">{" " + process.env.NEXT_PUBLIC_NETWORK}</span>
          </div>
          <Disclosure as="nav" className="pt-2 relative z-10">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-6xl px-4 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Link href={homePath}>
                          <Logo />
                        </Link>
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <div className="nav-connect-button"><ConnectButton /></div>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                      <div className="flex items-center">
                        <div className="hidden lg:ml-10 lg:block">
                          <div className="flex space-x-8">
                            {navigation.map((item) => (
                              <Link
                                key={item.name}
                                href={item.locked ? '#' : item.href}
                                className={classNames("flex items-center", item?.locked ? "text-white/80" : "text-white hover:underline")}
                                aria-current={item.current ? "page" : undefined}
                              >
                                {item?.locked ? <LockClosedIcon className="w-4 mr-1" /> : <item.icon className="w-4 mr-1" />} {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-8 flex-shrink-0">
                          <div>
                            <div className="nav-connect-button"><ConnectButton /></div>
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
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block py-2 px-4 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                              {/* <Menu.Item>
                                <a
                                  className={classNames(
                                    "block py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                  )}
                                  onClick={logout}
                                >
                                  Disconnect
                                </a>
                              </Menu.Item> */}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden bg-neutral-950 border border-neutral-900 bg-opacity-40 mx-6 rounded-md mt-2">
                  <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <Disclosure.Button
                          as="span"
                          className={classNames("text-white block rounded-md py-2 px-3 text-base font-medium")}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Disclosure.Button>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-4 pb-3">
                    <div className="space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-opacity-75"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                      {/* <Disclosure.Button
                        as="a"
                        className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-opacity-75"
                        onClick={logout}
                      >
                        Disconnect
                      </Disclosure.Button> */}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <main className="relative z-20 px-4 lg:px-8">{children}</main>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-28 bg-transparent font-light relative z-10">
          <ul className="flex items-center justify-center sm:space-x-8 text-sm text-white flex-wrap space-x-8 space-y-2 sm:space-y-0">
            <li>
              <a href="https://coindrip.finance/" target="_blank" rel="noreferrer" className="hover:underline">
                Website
              </a>
            </li>
            <li>
              <a href="https://twitter.com/CoinDripHQ" target="_blank" rel="noreferrer" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://forms.gle/gXbBRHjk3PK6vsNi6"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Feedback
              </a>
            </li>
            <li>
              <a href="https://coindrip.finance/#faq" target="_blank" rel="noreferrer" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="mailto:contact@coindrip.finance" className="hover:underline">
                contact@coindrip.finance
              </a>
            </li>
          </ul>
          <ul className="flex items-center justify-center sm:space-x-8 text-xs mt-8 text-slate-200 flex-col sm:flex-row space-y-4 sm:space-y-0 font-light">
            <li>CoinDrip Protocol v{ContractAbi.buildInfo.contractCrate.version}</li>
            {/* <li>Build {process.env.BUILD_ID}</li> */}
          </ul>
        </footer>

        <img
          src="/bg-gradient.png"
          alt=""
          className="hidden sm:block fixed bottom-0 left-0 right-0 mx-auto pointer-events-none"
        />
        <img
          src="/bg-gradient.png"
          alt=""
          className="sm:hidden fixed bottom-0 inset-x-0 mx-auto pointer-events-none h-1/3 object-cover"
        />
      </div>
    </>
  );
}
