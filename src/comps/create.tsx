import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, PackagePlus } from "lucide-react";
import { useState } from "react";
export default function Create() {
  const [creating, setCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    domain: "",
    description: "",
  });
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => !open}></Dialog>
    </div>
  );
}
