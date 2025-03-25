import { ChangeEvent, useEffect, useState } from 'react';
import Papa, { LocalFile } from 'papaparse';
import { useFieldArray, useFormContext } from 'react-hook-form';
import moment from 'moment';
import { streamItemSchema } from '../../pages/new';
import { getShortAddress } from '../../utils/presentation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { ICreateStream } from '../../types';

interface CSVRow {
    address: string;
    amount: string;
    duration: string;
}

interface ProcessedRow {
    recipient: string;
    amount: number;
    duration: number;
}

export default function CsvCreateStream({ selectedToken }: { selectedToken?: string }) {
    const [dataArray, setDataArray] = useState<ProcessedRow[]>([]);
    const [errorData, setErrorData] = useState<ProcessedRow[]>([]);

    const { control } = useFormContext<ICreateStream>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "streams",
    });

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0] as LocalFile;

        Papa.parse<CSVRow>(file, {
            complete: (result: any) => {
                // Assuming the CSV has headers
                const parsedData = result.data.map((row: CSVRow) => {

                    let duration = 0;
                    const durationSegments = row.duration.split(' ');
                    for (let i = 0; i < durationSegments.length; i += 2) {
                        const value = Number(durationSegments[i]);
                        const unit = durationSegments[i + 1];
                        duration += moment.duration(value, unit as any).asSeconds();
                    }

                    return {
                        recipient: row.address,
                        amount: Number(row.amount), // Convert to number if needed
                        duration: duration
                    }
                });
                setDataArray(parsedData);
            },
            header: true, // Set to true if your CSV has headers
            skipEmptyLines: true
        });
    };

    useEffect(() => {
        if (!dataArray?.length) return;

        fields.forEach((field, index) => {
            remove(index);
        });

        dataArray.forEach((data: any) => {
            const { error, value } = streamItemSchema.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });

            if (!error) {
                append(data);
            } else {
                setErrorData((prev) => [...prev, data]);
            }
        });
    }, [dataArray])

    return (
        <div>
            {/* <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
            /> */}

            <FileUpload onFileSelect={handleFileUpload} />

            {!!fields.length && <>
                <div className="w-full overflow-x-auto mt-4">
                    <table className="sm:table-fixed streams-table">
                        <thead>
                            <tr className="text-left uppercase">
                                <th>recipient</th>
                                <th>amount/to</th>
                                <th>duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={index}>
                                    <td className="text-neutral-400">{getShortAddress(field.recipient, 6)}</td>
                                    <td className="text-neutral-400">{field.amount} {selectedToken}</td>
                                    <td className="text-neutral-400">{moment.duration(field.duration).humanize()}</td>
                                </tr>
                            ))}
                            {errorData.map((field, index) => (
                                <tr key={index} className='text-orange-400'>
                                    <td><ExclamationTriangleIcon className='inline-block w-4 mr-2' /> {getShortAddress(field.recipient, 6)}</td>
                                    <td>{field.amount} {selectedToken}</td>
                                    <td>{moment.duration(field.duration).humanize()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className='mt-4 text-sm text-neutral-400'><span className='font-bold'>Please double check the data</span> before signing the transaction. If you see any errors, please update the CSV file and upload it again.</p>
            </>}
        </div>
    );
}