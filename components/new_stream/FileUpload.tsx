import { useRef, ChangeEvent, useState, DragEventHandler } from 'react';

// Define props interface
interface CustomFileUploadProps {
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    disabled?: boolean;
}

export default function FileUpload({
    onFileSelect,
    accept = '.csv',
    disabled = false,
}: CustomFileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && !disabled) {
            onFileSelect(event);
            setFileName(file.name);
        }
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            // @ts-ignore
            onFileSelect({ target: { files: [file] } });
        }
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    return (
        <div className="space-y-4 mb-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
            />

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
                className="border border-dashed border-neutral-900 rounded-lg p-8 
                  text-center hover:border-neutral-800 transition-colors 
                  duration-200 bg-neutral-950"
            >
                <p className="text-neutral-400 text-sm mb-3">
                    {fileName || 'Drag and drop your CSV file here, or'}
                </p>
                <button
                    className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg 
                    hover:bg-neutral-900 transition-colors 
                    duration-200 focus:outline-none text-sm"
                >
                    Browse Files
                </button>
            </div>
        </div>
    );
}