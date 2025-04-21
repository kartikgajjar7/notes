"use client";
import React from "react";
import Image from "next/image";
import VaulDrawer from "./drawer";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Package, PackagePlus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function Navbar() {
  const [creating, setCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    domain: "",
    description: "",
  });
  return (
    <div className="h-[52px] w-full flex justify-between border-b-[rgba(255, 255, 255, 0.1)] border-b border-[rgba(255,255,255,0.1)] px-[1rem] items-center">
      <div>
        <Image src="/IMG_4307.png" width={40} height={40} alt="logo" />
      </div>
      <div className="flex justify-items-center gap-3">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <div className="[display:var(--light,block)_var(--dark,none)]">
              <div
                className="group relative isolate inline-flex items-center py-[7px] justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transtion-opacity rounded-md shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay text-sm px-3 cursor-pointer  ring-1 bg-black  text-white ring-gray-900"
                data-sentry-element="Component"
                data-sentry-component="LinkButton"
                data-sentry-source-file="Button.tsx"
              >
                Create Note
                <svg
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                  className="ml-2 h-2.5 w-2.5 flex-none opacity-60 group-hover:translate-x-6 group-hover:opacity-0 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transtion-opacity"
                  data-sentry-element="svg"
                  data-sentry-source-file="Button.tsx"
                  data-sentry-component="ArrowIcon"
                >
                  <path
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                    data-sentry-element="path"
                    data-sentry-source-file="Button.tsx"
                  ></path>
                </svg>
                <svg
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                  className="-ml-2.5 h-2.5 w-2.5 flex-none -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transtion-opacity"
                  data-sentry-element="svg"
                  data-sentry-source-file="Button.tsx"
                  data-sentry-component="ArrowIcon"
                >
                  <path
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                    data-sentry-element="path"
                    data-sentry-source-file="Button.tsx"
                  ></path>
                </svg>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="md:w-[600px] border-[#2E2E2E]  bg-[#000000] md:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex text-white items-center gap-2">
                New Note
                <span className="text-white">
                  <PackagePlus size={16} className="font-normal" />
                </span>
              </DialogTitle>
              <div className="px-4 h-full  ">
                <div className="flex flex-col items-start gap-2 mt-2  py-2 border-[#2E2E2E] border-b">
                  <Package size={18} className="ml-2 text-white" />
                  <Input
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                    style={{ fontSize: "24px" }}
                    className="bg-transparent border-none focus-visible:ring-0  border-b-1 border-[#2E2E2E]  rounded-none px-2 py-1  h-full font-medium text-white placeholder:text-[24px] placeholder:text-[#626366]"
                    placeholder="Title Of The Note"
                    name="name"
                    value={data.name}
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                    style={{ fontSize: "14px" }}
                    className="bg-transparent px-2 py-1 border-0 focus-visible:ring-0 outline-0 h-[320px] font-medium text-white placeholder:text-[14px] placeholder:text-[#626366] resize-none"
                    placeholder="Write a description, a project brief..."
                    name="description"
                    value={data.description}
                  />
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="px-2 pt-3 border-[#383b4183] border-t">
              <Button
                onClick={() => setIsOpen(false)}
                variant={"outline"}
                className=""
              >
                Cancel
              </Button>
              <Button variant={"outline"} className="  ">
                {creating ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <VaulDrawer />
      </div>
    </div>
  );
}
