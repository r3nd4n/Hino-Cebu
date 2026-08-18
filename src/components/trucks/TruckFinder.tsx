"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Answers = { industry: string; cargo: string; payload: string; body: string; environment: string; fleetSize: string; timeline: string };
type Rule = { id: string; match: Partial<Record<keyof Answers, string[]>>; models: string[]; reason: string };
export type FinderModel = { slug: string; name: string };

const initial: Answers = { industry: "", cargo: "", payload: "", body: "", environment: "", fleetSize: "", timeline: "" };
const rules: Rule[] = [
  { id: "compact", match: { payload: ["under-2"], environment: ["urban"] }, models: ["hino-200", "hino-300"], reason: "Your lighter payload estimate and urban operating environment suggest starting with compact and light-duty model families." },
  { id: "light", match: { payload: ["2-5"], industry: ["delivery", "retail", "food"] }, models: ["hino-300"], reason: "Your distribution use and estimated payload point toward a versatile light-duty starting point." },
  { id: "medium", match: { payload: ["over-5"], industry: ["logistics", "construction", "agriculture"] }, models: ["hino-500"], reason: "Your higher estimated payload or demanding application suggests beginning with a medium-duty consultation." },
  { id: "fleet", match: { fleetSize: ["6-20", "21-plus"] }, models: ["hino-300", "hino-500"], reason: "A broader fleet requirement benefits from comparing duty classes, routes, and standardized body needs." },
];

const questions: { key: keyof Answers; label: string; options: [string, string][] }[] = [
  { key: "industry", label: "Industry / business type", options: [["delivery", "Delivery"], ["logistics", "Logistics"], ["construction", "Construction"], ["food", "Food & beverage"], ["agriculture", "Agriculture"], ["retail", "Retail / wholesale"], ["other", "Other"]] },
  { key: "cargo", label: "Typical cargo", options: [["general", "General goods"], ["food", "Food / beverage"], ["materials", "Construction materials"], ["agri", "Agricultural goods"], ["equipment", "Equipment / tools"], ["other", "Other"]] },
  { key: "payload", label: "Estimated payload range", options: [["under-2", "Under 2 tonnes"], ["2-5", "2–5 tonnes"], ["over-5", "Over 5 tonnes"], ["unknown", "Not sure"]] },
  { key: "body", label: "Body / application preference", options: [["van", "Closed / van body"], ["dropside", "Dropside"], ["refrigerated", "Refrigerated"], ["specialized", "Specialized"], ["unknown", "Not sure"]] },
  { key: "environment", label: "Operating environment", options: [["urban", "Mostly urban"], ["mixed", "Mixed city / provincial"], ["site", "Work sites / demanding roads"], ["longhaul", "Longer regional routes"]] },
  { key: "fleetSize", label: "Current / planned fleet size", options: [["1", "1 vehicle"], ["2-5", "2–5 vehicles"], ["6-20", "6–20 vehicles"], ["21-plus", "21+ vehicles"]] },
  { key: "timeline", label: "Purchase timeline", options: [["0-3", "Within 3 months"], ["3-6", "3–6 months"], ["6-plus", "6+ months"], ["research", "Researching"]] },
];

export function recommend(answers: Answers, models: readonly FinderModel[]) {
  const eligibleSlugs = new Set(models.map(({ slug }) => slug));
  const scored = rules.map((rule) => ({ rule, score: Object.entries(rule.match).reduce((score, [key, values]) => score + (values?.includes(answers[key as keyof Answers]) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  const best = scored[0];
  const selected = best?.score ? best.rule : { id: "consult", match: {}, models: models.map(({ slug }) => slug), reason: "Your answers are a useful starting point. Comparing model families with Hino Cebu will help account for cargo, body, payload, and route details." };
  return { ...selected, models: selected.models.filter((slug) => eligibleSlugs.has(slug)) };
}

export function TruckFinder({ models, consultationHref }: { models: readonly FinderModel[]; consultationHref?: string }) {
  const [answers, setAnswers] = useState(initial); const [result, setResult] = useState<ReturnType<typeof recommend> | null>(null);
  const complete = Object.values(answers).every(Boolean);
  const modelsBySlug = new Map(models.map((model) => [model.slug, model]));
  return <div className="finder">
    <form onSubmit={(event) => { event.preventDefault(); const next = recommend(answers, models); setResult(next); track("truck_finder_completed", { recommendation: next.models.join(",") }); }} onFocus={() => track("truck_finder_started", { page: "/find-your-truck" })}>
      <div className="finder-grid">{questions.map((question) => <div className="field" key={question.key}><label htmlFor={question.key}>{question.label}</label><select id={question.key} value={answers[question.key]} onChange={(e) => setAnswers({ ...answers, [question.key]: e.target.value })} required><option value="">Select an option</option>{question.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>)}</div>
      <button className="button" disabled={!complete}>Show my starting point</button>
    </form>
    {result && <section className="finder-result" aria-live="polite"><span className="eyebrow">Preliminary recommendation</span><h2>{result.models.map((slug) => modelsBySlug.get(slug)?.name).filter(Boolean).join(" and ")}</h2><p>{result.reason}</p><div className="recommendation-links">{result.models.map((slug) => { const model = modelsBySlug.get(slug); return model ? <Link className="button button-outline" href={`/trucks/${slug}`} key={slug}>View {model.name}</Link> : null; })}{consultationHref ? <Link className="button" href={consultationHref}>Request a consultation</Link> : null}</div><small>This is a preliminary model-family suggestion, not confirmation of payload, body, regulatory, or technical suitability. Final configuration requires consultation and verified specifications.</small></section>}
  </div>;
}
