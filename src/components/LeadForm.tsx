"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { fmt, getDictionary } from "@/lib/i18n/dictionary";
import styles from "./LeadForm.module.css";

export type FormProgram = {
  slug: string;
  title: string;
  categorySlug: string;
  levelName: string;
  schoolName: string;
  level: string;
  mode: string;
};

type Step = 0 | 1 | 2 | 3 | 4;
const TOTAL_STEPS = 5;

type State = {
  field: string;
  currentLevel: string;
  goal: string;
  mode: string;
  startWindow: string;
  program: string;
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  question: string;
  consent: boolean;
};

const EMPTY: State = {
  field: "",
  currentLevel: "",
  goal: "",
  mode: "",
  startWindow: "",
  program: "",
  fullName: "",
  phone: "",
  email: "",
  whatsapp: "",
  question: "",
  consent: false,
};

/**
 * Five-step advice request.
 *
 * Two things it deliberately does not do: it never tells the visitor they
 * qualify for anything, and its suggestions are drawn from the published
 * programme list by simple rules - stated as "may fit", never as a decision.
 */
export function LeadForm({
  locale,
  categories,
  programs,
  initialProgram,
}: {
  locale: Locale;
  categories: { slug: string; label: string }[];
  programs: FormProgram[];
  initialProgram?: string;
}) {
  const dict = getDictionary(locale);
  const [step, setStep] = useState<Step>(0);
  const [state, setState] = useState<State>({ ...EMPTY, program: initialProgram ?? "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((current) => ({ ...current, [key]: value }));

  /**
   * Rule-based shortlist. Only real, published programmes appear here, and the
   * rules only narrow - they never manufacture a match.
   */
  const suggestions = useMemo(() => {
    let list = programs;
    if (state.field) list = list.filter((p) => p.categorySlug === state.field);
    if (state.mode === "abroad") {
      const abroad = list.filter((p) => p.mode === "abroad");
      if (abroad.length) list = abroad;
    }
    if (state.currentLevel === "thcs") {
      const entry = list.filter((p) => p.level === "trung_cap" || p.level === "so_cap");
      if (entry.length) list = entry;
    }
    if (state.currentLevel === "thpt" || state.currentLevel === "trung_cap") {
      const higher = list.filter((p) => p.level === "cao_dang" || p.level === "trung_cap");
      if (higher.length) list = higher;
    }
    if (state.goal === "abroad") {
      const german = list.filter(
        (p) => p.mode === "abroad" || /Đức|German|Deutsch/i.test(p.title),
      );
      if (german.length) list = german;
    }
    return list.slice(0, 4);
  }, [programs, state.field, state.mode, state.currentLevel, state.goal]);

  const hasContact = Boolean(state.phone.trim() || state.email.trim() || state.whatsapp.trim());

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!state.fullName.trim()) return setError(dict.form.nameRequired);
    if (!hasContact) return setError(dict.form.contactRequired);
    if (!state.consent) return setError(dict.form.consentRequired);

    setStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...state,
          locale,
          source: "website_form",
          consentText: dict.form.consent,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; id?: number; message?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setError(dict.form.failed);
        return;
      }
      setReference(data.id ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
      setError(dict.form.failed);
    }
  }

  if (status === "done") {
    return (
      <div className={styles.done} role="status">
        <h2>{dict.form.success}</h2>
        <p>{fmt(dict.form.successLead, { id: reference ? `VDG-${reference}` : "—" })}</p>
        <Link href={localePath(locale, "/dao-tao/chuong-trinh")} className={styles.doneLink}>
          {dict.nav.explorer}
        </Link>
      </div>
    );
  }

  const stepTitles = [
    dict.form.stepField,
    dict.form.stepLevel,
    dict.form.stepGoal,
    dict.form.stepMode,
    dict.form.stepContact,
  ];

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <ol className={styles.steps} aria-label={fmt(dict.form.step, { n: step + 1, total: TOTAL_STEPS })}>
        {stepTitles.map((title, index) => (
          <li
            key={title}
            className={index === step ? styles.stepOn : index < step ? styles.stepDone : styles.step}
            aria-current={index === step ? "step" : undefined}
          >
            <button
              type="button"
              onClick={() => setStep(index as Step)}
              disabled={index > step}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.stepLabel}>{title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.panel}>
        {step === 0 ? (
          <fieldset>
            <legend>{dict.form.stepField}</legend>
            <div className={styles.options}>
              {categories.map((category) => (
                <Choice
                  key={category.slug}
                  name="field"
                  value={category.slug}
                  checked={state.field === category.slug}
                  onChange={(value) => set("field", value)}
                  label={category.label}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset>
            <legend>{dict.form.stepLevel}</legend>
            <div className={styles.options}>
              {Object.entries(dict.form.levels).map(([value, label]) => (
                <Choice
                  key={value}
                  name="level"
                  value={value}
                  checked={state.currentLevel === value}
                  onChange={(v) => set("currentLevel", v)}
                  label={label}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset>
            <legend>{dict.form.stepGoal}</legend>
            <div className={styles.options}>
              {Object.entries(dict.form.goals).map(([value, label]) => (
                <Choice
                  key={value}
                  name="goal"
                  value={value}
                  checked={state.goal === value}
                  onChange={(v) => set("goal", v)}
                  label={label}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <>
            <fieldset>
              <legend>{dict.explorer.mode}</legend>
              <div className={styles.options}>
                {Object.entries(dict.form.modes).map(([value, label]) => (
                  <Choice
                    key={value}
                    name="mode"
                    value={value}
                    checked={state.mode === value}
                    onChange={(v) => set("mode", v)}
                    label={label}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset className={styles.spaced}>
              <legend>{{ vi: "Thời gian có thể bắt đầu", en: "When you could start", de: "Möglicher Beginn" }[locale]}</legend>
              <div className={styles.options}>
                {Object.entries(dict.form.windows).map(([value, label]) => (
                  <Choice
                    key={value}
                    name="window"
                    value={value}
                    checked={state.startWindow === value}
                    onChange={(v) => set("startWindow", v)}
                    label={label}
                  />
                ))}
              </div>
            </fieldset>
          </>
        ) : null}

        {step === 4 ? (
          <fieldset>
            <legend>{dict.form.stepContact}</legend>

            {suggestions.length ? (
              <div className={styles.suggested}>
                <p className={styles.suggestedTitle}>{dict.form.suggested}</p>
                <div className={styles.suggestedList}>
                  {suggestions.map((program) => (
                    <label key={program.slug} className={styles.suggestedItem}>
                      <input
                        type="radio"
                        name="program"
                        value={program.slug}
                        checked={state.program === program.slug}
                        onChange={() => set("program", program.slug)}
                      />
                      <span>
                        <strong>{program.title}</strong>
                        <small>
                          {program.levelName}
                          {program.schoolName ? ` · ${program.schoolName}` : ""}
                        </small>
                      </span>
                    </label>
                  ))}
                </div>
                <p className={styles.suggestedHint}>{dict.form.suggestedHint}</p>
              </div>
            ) : null}

            <div className={styles.fields}>
              <Field
                id="lead-name"
                label={dict.form.fullName}
                required
                value={state.fullName}
                onChange={(v) => set("fullName", v)}
                autoComplete="name"
              />
              <Field
                id="lead-phone"
                label={dict.form.phone}
                type="tel"
                value={state.phone}
                onChange={(v) => set("phone", v)}
                autoComplete="tel"
              />
              <Field
                id="lead-email"
                label={dict.form.email}
                type="email"
                value={state.email}
                onChange={(v) => set("email", v)}
                autoComplete="email"
              />
              <Field
                id="lead-whatsapp"
                label={dict.form.whatsapp}
                type="tel"
                value={state.whatsapp}
                onChange={(v) => set("whatsapp", v)}
              />
            </div>
            <p className={styles.hint}>{dict.form.contactHint}</p>

            <label className={styles.textareaLabel} htmlFor="lead-question">
              {dict.form.question}
              <span className={styles.optional}>({dict.common.optional})</span>
            </label>
            <textarea
              id="lead-question"
              className={styles.textarea}
              rows={3}
              maxLength={1000}
              value={state.question}
              onChange={(event) => set("question", event.target.value)}
            />

            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={state.consent}
                onChange={(event) => set("consent", event.target.checked)}
              />
              <span>
                {dict.form.consent}{" "}
                <Link href={localePath(locale, "/chinh-sach-bao-mat")} target="_blank">
                  {dict.footer.privacy}
                </Link>
              </span>
            </label>
          </fieldset>
        ) : null}

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.back}
            onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
            disabled={step === 0}
          >
            {dict.common.previous}
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              className={styles.next}
              onClick={() => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1) as Step)}
            >
              {dict.common.next}
            </button>
          ) : (
            <button type="submit" className={styles.next} disabled={status === "sending"}>
              {status === "sending" ? dict.common.loading : dict.common.submit}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className={checked ? styles.choiceOn : styles.choice}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required ? <abbr title="required"> *</abbr> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
