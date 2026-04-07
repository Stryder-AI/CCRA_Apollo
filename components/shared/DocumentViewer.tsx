'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle } from 'lucide-react'

interface DocumentViewerProps {
  documentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewer({
  documentName,
  open,
  onOpenChange,
}: DocumentViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <DialogTitle>{documentName}</DialogTitle>
          </div>
          <DialogDescription>Document preview</DialogDescription>
        </DialogHeader>

        {/* Mock document preview area */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/40 h-[280px]">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            Document Preview
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Preview not available in demo mode
          </p>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge
                variant="outline"
                className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <span>Uploaded 15 Jan 2026</span>
              <span>248 KB</span>
            </div>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
