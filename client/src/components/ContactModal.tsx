import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId?: string;
  agencyName: string;
  agencyEmail: string;
  recruiterEmail?: string;
  recruiterName?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  agencyId,
  agencyName,
  agencyEmail,
  recruiterEmail,
  recruiterName,
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const submitInquiry = trpc.agencies.submitInquiry.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await submitInquiry.mutateAsync({
        agencyId: agencyId || agencyName,
        agencyName,
        agencyEmail,
        recruiterEmail,
        recruiterName,
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone || null,
        message: formData.message,
      });

      window.location.href = result.mailtoUrl;

      toast.success(
        result.notifiedOwner
          ? "Inquiry prepared and owner notification sent."
          : "Opening your email client to send the inquiry."
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
    } catch {
      toast.error("Failed to prepare your inquiry. Please try again.");
    }
  };

  const recipientLabel = recruiterEmail || agencyEmail || "No contact email available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {agencyName}</DialogTitle>
          <DialogDescription>
            Send your inquiry to {recruiterName ? `${recruiterName} at ${agencyName}` : agencyName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <User className="mr-2 inline h-4 w-4" />
              Your Name
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <Mail className="mr-2 inline h-4 w-4" />
              Your Email
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <Phone className="mr-2 inline h-4 w-4" />
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+44 123 456 7890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
            <Textarea
              placeholder="Tell us about your job search or inquiry..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
              className="w-full"
            />
          </div>

          <Card className="border-blue-200 bg-blue-50 p-4">
            <p className="mb-2 text-sm text-slate-600">
              <strong>Sending to:</strong>
            </p>
            <p className="text-sm font-medium text-slate-900">
              {recruiterName && `${recruiterName} - `}
              {recipientLabel}
            </p>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitInquiry.isPending || (!agencyEmail && !recruiterEmail)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitInquiry.isPending ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
