"use client"


import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const Textbalance = () => {
  const router = useRouter();
return (
  <Field className="text-black">
   <Input
  id="input-field-username"
  type="text"
  placeholder="H2 + O2 = 2H2O"
  className="bg-white text-black border-2 border-indigo-300 placeholder:text-slate-500"
/>

    <FieldDescription className="text-black">
      informação da molécula   
    </FieldDescription>
  </Field>
);
};

export default Textbalance;