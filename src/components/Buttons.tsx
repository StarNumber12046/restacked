"use client";
import { Clipboard, Check, Cross } from "lucide-react";

import { useEffect, useState } from "react";


export function CopyButton({ text }: { text: string }) {
  const [icon, setIcon] = useState(<Clipboard />);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    if (complete) {
      setTimeout(() => {
        setIcon(<Clipboard />);
        setComplete(false);
      }, 1000);
    }
  }, [complete]);
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIcon(<Check className="text-green-500" />)
      })
      .catch(() => setIcon(<Cross className="text-red-500" />));
      setComplete(true)
  };
  return <button onClick={copyToClipboard} className="animate-fade transition-all">{icon}</button>;
}
