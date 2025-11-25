import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertTriangle } from 'lucide-react';

interface DeclineReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, category: string) => void;
  visitorName: string;
}

const declineCategories = [
  'Security Concerns',
  'Unauthorized Visit',
  'Incomplete Information',
  'Schedule Conflict', 
  'Policy Violation',
  'Missing Documentation',
  'Other'
];

export function DeclineReasonDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  visitorName 
}: DeclineReasonDialogProps) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');

  const handleConfirm = () => {
    if (reason.trim() && category) {
      onConfirm(reason.trim(), category);
      setReason('');
      setCategory('');
      onClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setCategory('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-slate-800">Decline Visitor Request</DialogTitle>
              <DialogDescription className="text-slate-600 text-sm mt-1">
                Declining request for: <span className="font-medium">{visitorName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-slate-700">Decline Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-slate-200 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {declineCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason Text */}
          <div className="space-y-2">
            <Label htmlFor="decline-reason" className="text-slate-700">
              Reason for Decline *
            </Label>
            <Textarea
              id="decline-reason"
              placeholder="Please provide a detailed reason for declining this visitor request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-slate-200 focus:border-red-500 focus:ring-red-500 resize-none min-h-[100px]"
              rows={4}
            />
            <p className="text-xs text-slate-500">
              This reason will be recorded and may be shared with the visitor.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim() || !category}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Decline Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}