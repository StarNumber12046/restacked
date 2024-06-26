"use client";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MultipleSelector, { type MultipleSelectorRef, type Option } from "~/components/ui/multiselect";
import { toast } from "sonner"
import type { Stack } from "@prisma/client";
import { useRouter } from "next/navigation";
export default function CreateForm({ components, tags }: { components: Option[], tags: Option[] }) {
  const componentsRef = useRef<MultipleSelectorRef>(null);
  const auth = useAuth();
  const tagsRef = useRef<MultipleSelectorRef>(null);
  const [init, setInit] = useState("");
  const [name, setName] = useState("");
  
  function submitEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.dismiss("status")
    if (componentsRef.current?.selectedValue.length === 0) {
      toast.error("Error", { description: "You need to select at least one component", icon: "❌", id: "status", closeButton: true });
      return;
    }
    if (tagsRef.current?.selectedValue.length === 0) {
      toast.error("Error", { description: "You need to select at least one tag", icon: "❌", id: "status", closeButton: true });
      return;
    }
    fetch("/api/stack", {
      method: "PUT",
      body: JSON.stringify({
        name,
        components: componentsRef.current?.selectedValue,
        tags: tagsRef.current?.selectedValue,
        ownerId: auth.userId,
        initializer: init
      })},
    ).then(() => {
      window.location.reload();
      toast.success("Success", { description: "Stack created", icon: "✅", id: "status", closeButton: true });
    }).catch(console.error);
  }
  return (
    <form className="flex flex-col gap-2 dark" onSubmit={submitEvent}>
      <div className="dark">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="rounded border-2 border-white bg-transparent p-2 transition-all duration-300"
          placeholder="My awesome tech stack"
        />
      </div>
        <MultipleSelector
          
          ref={componentsRef}
          defaultOptions={components}
          placeholder="Components"
          emptyIndicator="No components found"
        />
        <MultipleSelector
          ref={tagsRef}
          defaultOptions={tags}
          placeholder="Tags"
          emptyIndicator="No tags found"
          creatable
        />
      <Label
        htmlFor="initializer"
        >Initializer Command</Label>
      <Input 
        type="text"
        className="rounded border-2 border-white bg-transparent p-2 transition-all duration-300"
        placeholder="pnpm create react-app@latest"
        name="initializer"
        value={init}
        onChange={(e) => setInit(e.target.value)}
        id="initializer"
        />
      <input
        type="submit"
        className="bg-anim rounded p-2 transition-all duration-300 "
        value={"Create"}
      />
    </form>
  );
}


export function EditForm({ components, tags, stack }: { components: Option[], tags: Option[], stack: Stack }) {
  const componentsRef = useRef<MultipleSelectorRef>(null);
  const auth = useAuth();
  const router = useRouter()
  const tagsRef = useRef<MultipleSelectorRef>(null);
  const [init, setInit] = useState(stack.initializer);
  const [name, setName] = useState(stack.name);

  
  function submitEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.dismiss("status")
    if (componentsRef.current?.selectedValue.length === 0) {
      toast.error("Error", { description: "You need to select at least one component", icon: "❌", id: "status", closeButton: true });
      return;
    }
    if (tagsRef.current?.selectedValue.length === 0) {
      toast.error("Error", { description: "You need to select at least one tag", icon: "❌", id: "status", closeButton: true });
      return;
    }
    fetch("/api/stack/" + stack.id + "", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        components: componentsRef.current?.selectedValue,
        tags: tagsRef.current?.selectedValue,
        ownerId: auth.userId,
        initializer: init
      })},
    ).then(() => {
      router.push("/my")
      // router.push("/stack/"+stack.id+"")
      toast.success("Success", { description: "Stack updated", icon: "✅", id: "status", closeButton: true });
    }).catch(console.error);
  }
  return (
    <form className="flex flex-col gap-2 dark" onSubmit={submitEvent}>
      <div className="dark">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="rounded border-2 border-white bg-transparent p-2 transition-all duration-300"
          placeholder="My awesome tech stack"
        />
      </div>
        <MultipleSelector
          
          ref={componentsRef}
          defaultOptions={components}
          
          placeholder="Components"
          emptyIndicator="No components found"
        />
        <MultipleSelector
          ref={tagsRef}
          defaultOptions={tags}
          placeholder="Tags"
          emptyIndicator="No tags found"
          creatable
        />
      <Label
        htmlFor="initializer"
        >Initializer Command</Label>
      <Input 
        type="text"
        className="rounded border-2 border-white bg-transparent p-2 transition-all duration-300"
        placeholder="pnpm create react-app@latest"
        
        name="initializer"
        value={init ?? ""}
        onChange={(e) => setInit(e.target.value)}
        id="initializer"
        />
      <input
        type="submit"
        className="bg-anim rounded p-2 transition-all duration-300 "
        value={"Create"}
      />
    </form>
  );
}
