"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
export default function VaulDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <div className="[display:var(--light,block)_var(--dark,none)] ml-3">
          <div
            className="group relative isolate inline-flex items-center py-[7px] justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transtion-opacity rounded-md shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay text-sm px-3 cursor-pointer  ring-1 bg-black  text-white ring-gray-900"
            data-sentry-element="Component"
            data-sentry-component="LinkButton"
            data-sentry-source-file="Button.tsx"
          >
            Talk to AI
          </div>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />
        <Drawer.Content className=" bg-zinc-900 h-fit overflow-hidden fixed bottom-0 left-0 right-0 outline-none">
          <div className="p-4 h-[700px] bg-zinc-900">
            <div className="mx-auto  w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8"></div>
            <div className=" px-10 h-[700px] overflow-scroll"></div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
