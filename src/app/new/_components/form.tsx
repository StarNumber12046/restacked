"use client";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MultipleSelector, { type MultipleSelectorRef, type Option } from "~/components/ui/multiselect";

export default function Form({ components, tags }: { components: Option[], tags: Option[] }) {
  const componentsRef = useRef<MultipleSelectorRef>(null);
  const auth = useAuth();
  const tagsRef = useRef<MultipleSelectorRef>(null);
  const [init, setInit] = useState("");
  const [name, setName] = useState("");
  function submitEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    fetch("/api/stack", {
      method: "PUT",
      body: JSON.stringify({
        name,
        components: componentsRef.current?.selectedValue,
        tags: tagsRef.current?.selectedValue,
        ownerId: auth.userId,
        initializer: init
      })},
    ).then(() => window.location.reload()).catch(console.error);
  }
  return (
    <form className="flex flex-col gap-2 dark" onSubmit={submitEvent}>
      <div className="dark">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
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
