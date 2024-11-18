import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react'
import { useCSVReader } from "react-papaparse";

interface UploadButtonProps {
  onUpload: (results: any) => void;
}

export const UploadButton = ({ onUpload }: UploadButtonProps) => {
  const { CSVReader } = useCSVReader();

  // TODO: Add  a paywall

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          size='sm'
          className="w-full lg:w-auto"
          {...getRootProps()}
        >
          <UploadIcon className='size-4 mr-2' />
          Import
        </Button>
      )}
    </CSVReader>
  )
}