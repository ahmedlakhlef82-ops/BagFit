'use client';

import * as React from 'react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { importAirlinesCSV } from '@/app/actions/admin-airlines';

interface ParsedAirline {
  name: string;
  iata_code: string;
  icao_code?: string;
  country: string;
  website?: string;
}

export function ImportForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<ParsedAirline[] | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setParsedData(null);
      setErrors([]);
    }
  };

  const handleParse = () => {
    if (!file) return;
    setIsParsing(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const data = results.data as any[];
        const validAirlines: ParsedAirline[] = [];
        const parseErrors: string[] = [];

        data.forEach((row, index) => {
          const rowNum = index + 2; // +2 because header is row 1 and arrays are 0-indexed

          if (!row.name || !row.iata_code || !row.country) {
             parseErrors.push(`Row ${rowNum}: Missing required fields (name, iata_code, or country).`);
             return;
          }

          if (row.iata_code.length !== 2) {
             parseErrors.push(`Row ${rowNum}: IATA code must be 2 characters.`);
             return;
          }

          if (row.icao_code && row.icao_code.length !== 3) {
             parseErrors.push(`Row ${rowNum}: ICAO code must be 3 characters.`);
             return;
          }

          validAirlines.push({
            name: row.name,
            iata_code: row.iata_code.toUpperCase(),
            icao_code: row.icao_code ? row.icao_code.toUpperCase() : null,
            country: row.country,
            website: row.website || null,
          });
        });

        if (parseErrors.length > 0) {
           setErrors(parseErrors);
        }

        if (validAirlines.length > 0) {
           setParsedData(validAirlines);
        } else {
           setParsedData(null);
           toast.error('No valid airlines found in the CSV.');
        }
      },
      error: (error) => {
        setIsParsing(false);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleUpload = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setIsUploading(true);

    try {
      const result = await importAirlinesCSV(parsedData);
      if (result.error) {
         toast.error(result.error);
      } else {
         toast.success(`Successfully imported ${result.count} airlines!`);
         setFile(null);
         setParsedData(null);
         setErrors([]);
      }
    } catch (e) {
      toast.error('An unexpected error occurred during import.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Upload CSV File</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Drag and drop your file here, or click to select a file from your computer.
            </p>
            <Button asChild variant="outline">
              <label className="cursor-pointer">
                Select CSV File
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </Button>

            {file && (
              <div className="mt-6 flex items-center p-3 border rounded-md w-full max-w-md bg-background">
                <File className="h-5 w-5 mr-3 text-primary" />
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {!parsedData && (
                  <Button size="sm" onClick={handleParse} disabled={isParsing}>
                    {isParsing && <Spinner className="h-3 w-3 mr-2" />}
                    Parse Data
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
             <div className="flex items-center text-destructive font-semibold mb-4">
               <AlertCircle className="h-5 w-5 mr-2" /> Validation Errors ({errors.length})
             </div>
             <div className="max-h-40 overflow-y-auto text-sm space-y-1">
               {errors.map((err, i) => (
                 <div key={i} className="text-destructive/80">• {err}</div>
               ))}
             </div>
             <p className="text-xs text-muted-foreground mt-4 border-t border-destructive/20 pt-2">
               Note: Invalid rows will be skipped during import. Valid rows can still be imported.
             </p>
          </CardContent>
        </Card>
      )}

      {parsedData && (
        <Card>
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-green-600 dark:text-green-500">Ready to Import</h3>
              <p className="text-muted-foreground text-sm">Found {parsedData.length} valid airlines in the CSV.</p>
            </div>
            <Button onClick={handleUpload} disabled={isUploading}>
               {isUploading && <Spinner className="h-4 w-4 mr-2" />}
               Import Airlines
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
