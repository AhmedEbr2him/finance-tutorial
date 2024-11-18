import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeadSelect } from './table-head-select';

type ImportTableProps = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, any>;
  onTableHeadChange: (columnIndex: number, value: string | null) => void;
}
export const ImportTable = ({
  headers,
  body,
  selectedColumns,
  onTableHeadChange
}: ImportTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            {
              headers.map((_items, index) => (
                <TableHead key={index}>
                  <TableHeadSelect
                    columnIndex={index}
                    selectedColumns={selectedColumns}
                    onChange={onTableHeadChange}
                  />
                </TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            body.map((row: string[], index) => (
              <TableRow key={index}>
                {row.map((cell, index) => (
                  <TableCell key={index}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}