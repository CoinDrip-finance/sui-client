import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function NumberInput({ label, formId }: { label: string; formId: string }) {
  const { register } = useFormContext();

  return (
    <div>
      <div className="block font-light text-sm mb-2">{label}</div>
      <div className="relative w-full">
        <input
          type="number"
          className="bg-neutral-950 rounded-lg border border-neutral-900 focus:border-neutral-900 h-12 font-medium text-sm focus:outline-none px-4 w-full"
          step="1"
          {...register(formId)}
        />
      </div>
    </div>
  );
}
