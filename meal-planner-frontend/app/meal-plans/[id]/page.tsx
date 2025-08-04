"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type MealPlan = {
  _id: string;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  recipes?: any[];
  image?: string;
  notes?: string;
  diet?: string[];
  allergies?: string;
};

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedGoal, setUpdatedGoal] = useState("");
  const [updatedStartDate, setUpdatedStartDate] = useState("");
  const [updatedEndDate, setUpdatedEndDate] = useState("");
  const [updatedDiet, setUpdatedDiet] = useState("");
  const [updatedAllergies, setUpdatedAllergies] = useState("");
  const [updatedNotes, setUpdatedNotes] = useState("");

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: {
            Authorization: session?.accessToken
              ? `Bearer ${session.accessToken}`
              : "",
          },
        });
        if (!res.ok) {
          setPlan(null);
          return;
        }
        const data = await res.json();
        setPlan(data.mealPlan || data.data || data);
      } catch (error) {
        setPlan(null);
      }
    }
    fetchPlan();
  }, [id, session]);

  useEffect(() => {
    if (plan) {
      setUpdatedTitle(plan.title);
      setUpdatedGoal(plan.goal);
      setUpdatedStartDate(plan.startDate);
      setUpdatedEndDate(plan.endDate);
      setUpdatedDiet((plan.diet || []).join(", "));
      setUpdatedAllergies(plan.allergies || "");
      setUpdatedNotes(plan.notes || "");
    }
  }, [plan]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/meal-plans/${plan!._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : "",
      },
      body: JSON.stringify({
        title: updatedTitle,
        goal: updatedGoal,
        startDate: updatedStartDate,
        endDate: updatedEndDate,
        diet: updatedDiet
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        allergies: updatedAllergies,
        notes: updatedNotes,
      }),
    });
    setShowUpdateForm(false);

    const res = await fetch(`/api/meal-plans/${plan!._id}`, {
      headers: {
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : "",
      },
    });
    const data = await res.json();
    setPlan(data.mealPlan || data.data || data);
  };

  if (!plan) return <div>loading...</div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-primary">Meal Plan</span>
          </h1>
        </div>
        <div className="grid gap-6">
          <div className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="bg-muted/50 rounded-lg p-4 mb-4 flex flex-col md:flex-row gap-6 items-start">
              {/* Details on the left */}
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold">Title:</span> {plan.title}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Goal:</span> {plan.goal}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Period:</span>{" "}
                  {plan.startDate} – {plan.endDate}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Diet:</span>{" "}
                  {(plan.diet || []).join(", ") || "None"}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Allergies:</span>{" "}
                  {plan.allergies || "None"}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Notes:</span>{" "}
                  {plan.notes || "None"}
                </div>
                <div>
                  <span className="font-semibold">Recipes:</span>{" "}
                  {plan.recipes ? plan.recipes.length : 0}
                </div>
                <Button
                  className="mt-4"
                  variant="default"
                  onClick={() => setShowUpdateForm(true)}
                >
                  Update Meal Plan
                </Button>

                {showUpdateForm && (
                  <form
                    onSubmit={handleUpdate}
                    className="mt-8 p-6 bg-background rounded-lg shadow space-y-5 border"
                  >
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        placeholder="Title"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="goal"
                      >
                        Goal
                      </label>
                      <input
                        id="goal"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedGoal}
                        onChange={(e) => setUpdatedGoal(e.target.value)}
                        placeholder="Goal"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="startDate"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedStartDate}
                        onChange={(e) => setUpdatedStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="endDate"
                      >
                        End Date
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedEndDate}
                        onChange={(e) => setUpdatedEndDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="diet"
                      >
                        Diet (comma separated)
                      </label>
                      <input
                        id="diet"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedDiet}
                        onChange={(e) => setUpdatedDiet(e.target.value)}
                        placeholder="e.g. vegan, gluten-free"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="allergies"
                      >
                        Allergies
                      </label>
                      <input
                        id="allergies"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedAllergies}
                        onChange={(e) => setUpdatedAllergies(e.target.value)}
                        placeholder="e.g. nuts, lactose"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-primary font-semibold mb-1"
                        htmlFor="notes"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        className="input w-full border rounded px-3 py-2"
                        value={updatedNotes}
                        onChange={(e) => setUpdatedNotes(e.target.value)}
                        placeholder="Additional notes"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" variant="default">
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUpdateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
              {/* Image on the right */}
              {plan.image && (
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="rounded-lg max-h-64 object-cover w-56 min-w-[8rem] shadow"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
