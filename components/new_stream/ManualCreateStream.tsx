import { Control, FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { ICreateStream } from "../../types";
import { CreateStreamAiInput } from "../../pages/new";
import { TokenWithMetadata } from "./TokenSelect";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../utils/presentation";
import AmountInput from "./AmountInput";
import DurationInput from "./DurationInput";
import NumberInput from "./NumberInput";
import RecipientInput from "./RecipientInput";

interface ManualCreateStreamProps {
    aiInput: CreateStreamAiInput | undefined;
    selectedToken: TokenWithMetadata | undefined;
    isCliffType: boolean;
    isStepsType: boolean;
}

export default function ManualCreateStream({ aiInput, selectedToken, isCliffType, isStepsType }: ManualCreateStreamProps) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "streams",
    });

    return <>
        {fields.map((field, index) => <>
            <RecipientInput fieldIndex={index} aiInput={aiInput} />

            <div className={classNames('flex', fields.length > 1 ? "space-x-4" : "flex-col space-y-4")}>
                <AmountInput fieldIndex={index} token={selectedToken} aiInput={aiInput} />

                <DurationInput fieldIndex={index} label="Duration" formId="duration" aiInput={aiInput} />

                {isCliffType && <DurationInput fieldIndex={index} label="Cliff" formId="cliff" />}

                {isStepsType && <NumberInput fieldIndex={index} label="Steps Count" formId="steps_count" />}
            </div>

            {fields.length > 1 && <button onClick={() => remove(index)} className='text-neutral-400 cursor-pointer text-sm flex items-center justify-end hover:underline'><TrashIcon className='w-4 mr-1' /> Remove stream</button>}

            {index + 1 < fields.length && <div className='h-[1px] bg-neutral-900 w-full'></div>}
        </>)}

        {!aiInput?.ai && <div className='flex items-center space-x-4 py-4 justify-center group cursor-pointer' onClick={() => append({ recipient: "", amount: 0, duration: 0 })}>
            <PlusIcon className='h-10 border rounded-md p-2 text-neutral-400 border-neutral-400 transition-all ease-in-out duration-300 group-hover:p-[9px]' />
            <span className='text-sm text-neutral-400  group-hover:underline'>Add new stream</span>
        </div>}
    </>
}