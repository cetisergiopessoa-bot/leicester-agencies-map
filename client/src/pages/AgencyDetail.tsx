import { ReactNode, useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Clock3, Globe, Linkedin, Loader2, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactModal } from "@/components/ContactModal";
import { MapboxMap } from "@/components/MapboxMap";
import { trpc } from "@/lib/trpc";
import type { AgencyReview, OpeningHours, Recruiter } from "@/lib/types";

const REVIEW_STORAGE_KEY_PREFIX = "agency-reviews:";

function normalizeRecruiters(recruiters: Recruiter[] | string | null | undefined): Recruiter[] {
  if (!recruiters) return [];
  if (Array.isArray(recruiters)) return recruiters;

  try {
    const parsed = JSON.parse(recruiters);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeOpeningHours(openingHours: OpeningHours | null | undefined) {
  if (!openingHours || typeof openingHours !== "object") return [];
  return Object.entries(openingHours);
}

export default function AgencyDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const agencyId = params?.id as string;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [reviewForm, setReviewForm] = useState({
    author: "",
    rating: 5,
    comment: "",
  });

  const { data: agency, isLoading } = trpc.agencies.getById.useQuery(
    { id: agencyId },
    { enabled: !!agencyId }
  );

  useEffect(() => {
    if (!agencyId || typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(`${REVIEW_STORAGE_KEY_PREFIX}${agencyId}`);
      if (!stored) {
        setReviews([]);
        return;
      }

      const parsed = JSON.parse(stored) as AgencyReview[];
      setReviews(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to load agency reviews:", error);
      setReviews([]);
    }
  }, [agencyId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-4 text-lg text-slate-500">Agency not found</p>
        <Button onClick={() => navigate("/")} variant="default">
          Back to Agencies
        </Button>
      </div>
    );
  }

  const recruiters = normalizeRecruiters(
    agency.recruiters as Recruiter[] | string | null | undefined
  );
  const openingHours = normalizeOpeningHours(
    agency.openingHours as OpeningHours | null | undefined
  );
  const firstRecruiter = recruiters[0] ?? null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const nextReview: AgencyReview = {
      id: `${agencyId}-${Date.now()}`,
      author: reviewForm.author.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextReviews = [nextReview, ...reviews];
    setReviews(nextReviews);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `${REVIEW_STORAGE_KEY_PREFIX}${agencyId}`,
        JSON.stringify(nextReviews)
      );
    }
    setReviewForm({ author: "", rating: 5, comment: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="mb-4 text-white hover:bg-blue-500"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agencies
          </Button>
          <h1 className="text-3xl font-bold">{agency.name}</h1>
          {agency.region && <p className="mt-2 text-blue-100">Region: {agency.region}</p>}
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {agency.description && (
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">About</h2>
                <p className="text-lg text-slate-600">{agency.description as ReactNode}</p>
              </Card>
            )}

            <Card className="mb-6 p-6">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Contact Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-slate-600">{agency.address}</p>
                  </div>
                </div>

                {agency.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <a href={`tel:${agency.phone}`} className="text-lg text-blue-600 hover:underline">
                        {agency.phone}
                      </a>
                    </div>
                  </div>
                )}

                {agency.email && (
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a href={`mailto:${agency.email}`} className="text-blue-600 hover:underline">
                        {agency.email}
                      </a>
                    </div>
                  </div>
                )}

                {agency.website && (
                  <div className="flex items-start gap-4">
                    <Globe className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Website</p>
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {agency.website}
                      </a>
                    </div>
                  </div>
                )}

                {agency.linkedIn && (
                  <div className="flex items-start gap-4">
                    <Linkedin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">LinkedIn</p>
                      <a
                        href={agency.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Company Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {openingHours.length > 0 && (
              <Card className="mb-6 p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Clock3 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Opening Hours</h2>
                </div>
                <div className="space-y-3">
                  {openingHours.map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
                    >
                      <span className="font-medium text-slate-800">{day}</span>
                      <span className="text-slate-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {recruiters.length > 0 && (
              <Card className="mb-6 p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Recruiters</h2>
                </div>

                <div className="space-y-4">
                  {recruiters.map((recruiter, index) => (
                    <div
                      key={`${recruiter.email}-${index}`}
                      className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <p className="text-lg font-semibold text-slate-900">{recruiter.name}</p>
                      <p className="mb-2 text-sm text-slate-500">{recruiter.specialization}</p>
                      <a href={`mailto:${recruiter.email}`} className="text-sm text-blue-600 hover:underline">
                        {recruiter.email}
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">Location</h2>
              <MapboxMap
                latitude={parseFloat(agency.latitude.toString())}
                longitude={parseFloat(agency.longitude.toString())}
                zoom={16}
                agencyName={agency.name}
                agencyAddress={agency.address}
              />
            </Card>

            <Card className="mt-6 p-6">
              <div className="mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
              </div>

              <form onSubmit={handleSubmitReview} className="mb-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                  <Input
                    placeholder="Your name"
                    value={reviewForm.author}
                    onChange={(e) =>
                      setReviewForm((current) => ({ ...current, author: e.target.value }))
                    }
                    required
                  />
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((current) => ({
                        ...current,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} star{rating > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <Textarea
                  placeholder="Share your experience with this agency..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((current) => ({ ...current, comment: e.target.value }))
                  }
                  rows={4}
                  required
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Review
                </Button>
              </form>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No reviews yet. Be the first to leave feedback.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{review.author}</p>
                        <p className="text-sm text-amber-600">
                          {`${review.rating}/5`}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6">
              <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                agencyId={agency.id}
                agencyName={agency.name}
                agencyEmail={agency.email || ""}
                recruiterEmail={firstRecruiter?.email || undefined}
                recruiterName={firstRecruiter?.name || undefined}
              />
              <h3 className="mb-4 text-xl font-bold text-slate-900">Quick Info</h3>

              <div className="space-y-4">
                {agency.region && (
                  <div>
                    <p className="text-sm font-semibold text-slate-500">REGION</p>
                    <p className="font-medium text-slate-900">{agency.region}</p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-500">COORDINATES</p>
                  <p className="text-xs text-slate-600">
                    {parseFloat(agency.latitude.toString()).toFixed(4)},{" "}
                    {parseFloat(agency.longitude.toString()).toFixed(4)}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <Button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    size="lg"
                  >
                    Contact Agency
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mt-16 bg-slate-900 py-8 text-center text-sm text-slate-300">
        <p>Employment Agencies in Leicester, England - Required Documents for UK Registration</p>
      </footer>
    </div>
  );
}
