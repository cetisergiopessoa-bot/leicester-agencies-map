import { useState } from "react";
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
import { toast } from "sonner";
import { Mail, Phone, User } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName: string;
  agencyEmail: string;
  recruiterEmail?: string;
  recruiterName?: string;
}

export function ContactModal({
  isOpen,
  onClose,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending email - in production, this would call a backend API
      const mailtoLink = `mailto:${recruiterEmail || agencyEmail}?subject=Job Inquiry - ${agencyName}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
      )}`;

      // Open email client
      window.location.href = mailtoLink;

      toast.success("Opening email client to send your inquiry...");
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {agencyName}</DialogTitle>
          <DialogDescription>
            Send your inquiry to{" "}
            {recruiterName ? `${recruiterName} at ${agencyName}` : agencyName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Your Name
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Your Email
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+44 123 456 7890"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <Textarea
              placeholder="Tell us about your job search or inquiry..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
              className="w-full"
            />
          </div>

          {/* Contact Info Display */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Sending to:</strong>
            </p>
            <p className="text-sm font-medium text-slate-900">
              {recruiterName && `${recruiterName} - `}
              {recruiterEmail || agencyEmail}
            </p>
          </Card>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
