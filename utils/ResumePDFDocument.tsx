// utils/ResumePDFDocument.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pure @react-pdf/renderer document — zero DOM contact, zero oklch issues.
// Works like Notion: data → PDF primitives → download.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";

// ── Register fonts (use built-in Helvetica family — no font loading needed) ──
// If you want custom fonts, register them here with Font.register().

// ── Palette (safe RGB strings, no oklch anywhere) ────────────────────────────
const C = {
  black:    "#111111",
  gray900:  "#1a1a1a",
  gray700:  "#374151",
  gray600:  "#4B5563",
  gray500:  "#6B7280",
  gray400:  "#9CA3AF",
  gray300:  "#D1D5DB",
  gray100:  "#F3F4F6",
  gray50:   "#F9FAFB",
  blue600:  "#2563EB",
  white:    "#FFFFFF",

  // Classic sidebar accent
  sidebar:  "#F3F4F6",

  // Minimal accent line
  accent:   "#111111",
};

// ── A4 page constants (pt at 72dpi) ──────────────────────────────────────────
const PAGE_PAD_H = 36; // horizontal padding
const PAGE_PAD_V = 36; // vertical padding

// ── Shared styles ─────────────────────────────────────────────────────────────
const shared = StyleSheet.create({
  page: {
    fontFamily:      "Helvetica",
    fontSize:        9,
    color:           C.black,
    backgroundColor: C.white,
    paddingHorizontal: PAGE_PAD_H,
    paddingVertical:   PAGE_PAD_V,
  },
  sectionTitle: {
    fontSize:      10,
    fontFamily:    "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom:  3,
    color:         C.gray900,
  },
  divider: {
    borderBottomWidth: 0.75,
    borderBottomColor: C.gray300,
    marginBottom:      6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:    "flex-start",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
  },
  small: {
    fontSize: 8,
    color:    C.gray600,
  },
  link: {
    color:          C.blue600,
    textDecoration: "none",
  },
});

// ────────────────────────────────────────────────────────────────────────────
// Section spacing helper
// ────────────────────────────────────────────────────────────────────────────
function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <View style={[{ marginBottom: 14 }, style || {}]}>{children}</View>;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View>
      <Text style={shared.sectionTitle}>{label}</Text>
      <View style={shared.divider} />
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MODERN TEMPLATE PDF
// ────────────────────────────────────────────────────────────────────────────
function ModernPDF({ resumeData }: { resumeData: ResumeData }) {
  const personal = resumeData.personal?.data;

  const contactParts: string[] = [];
  if (personal?.email)    contactParts.push(personal.email);
  if (personal?.phone)    contactParts.push(personal.phone);
  if (personal?.location) contactParts.push(personal.location);

  return (
    <>
      {/* ── HEADER ── */}
      {personal && (
        <Section style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: C.gray900 }}>
            {personal.fullName}
          </Text>
          {personal.title && (
            <Text style={{ fontSize: 10, color: C.gray600, marginTop: 2 }}>
              {personal.title}
            </Text>
          )}

          {/* contact row */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5, gap: 0 }}>
            {contactParts.map((p, i) => (
              <Text key={i} style={{ fontSize: 8, color: C.gray600 }}>
                {i > 0 ? "  •  " : ""}{p}
              </Text>
            ))}
            {personal.linkedin && (
              <Link src={personal.linkedin} style={[shared.link, { fontSize: 8, marginLeft: 6 }]}>
                {"  •  "}LinkedIn
              </Link>
            )}
            {personal.github && (
              <Link src={personal.github} style={[shared.link, { fontSize: 8, marginLeft: 4 }]}>
                {"  •  "}GitHub
              </Link>
            )}
            {personal.portfolio && (
              <Link src={personal.portfolio} style={[shared.link, { fontSize: 8, marginLeft: 4 }]}>
                {"  •  "}Portfolio
              </Link>
            )}
          </View>

          {/* header bottom rule */}
          <View style={[shared.divider, { marginTop: 8 }]} />
        </Section>
      )}

      {/* ── SUMMARY ── */}
      {resumeData.summary?.visible && resumeData.summary.data && (
        <Section>
          <SectionHeader label="Summary" />
          <Text style={{ fontSize: 9, color: C.gray700, lineHeight: 1.5 }}>
            {resumeData.summary.data as string}
          </Text>
        </Section>
      )}

      {/* ── EXPERIENCE ── */}
      {resumeData.experience?.visible && Array.isArray(resumeData.experience.data) &&
        resumeData.experience.data.length > 0 && (
        <Section>
          <SectionHeader label="Experience" />
          {(resumeData.experience.data as any[]).map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }} wrap={false}>
              <View style={shared.row}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5 }}>{exp.role}</Text>
                <Text style={shared.small}>{exp.duration}</Text>
              </View>
              <Text style={[shared.italic, { fontSize: 8.5, color: C.gray600, marginTop: 1 }]}>
                {exp.company}{exp.location ? ` • ${exp.location}` : ""}
              </Text>
              {Array.isArray(exp.responsibilities) && exp.responsibilities.map((r: string, j: number) => (
                <View key={j} style={{ flexDirection: "row", marginTop: 2.5 }}>
                  <Text style={{ fontSize: 8, color: C.gray700, marginRight: 4 }}>•</Text>
                  <Text style={{ fontSize: 8, color: C.gray700, flex: 1, lineHeight: 1.4 }}>{r}</Text>
                </View>
              ))}
              {typeof exp.responsibilities === "string" && (
                <Text style={{ fontSize: 8, color: C.gray700, marginTop: 2 }}>{exp.responsibilities}</Text>
              )}
              {exp.skillsUsed && (
                <Text style={[shared.italic, { fontSize: 7.5, color: C.gray500, marginTop: 3 }]}>
                  {exp.skillsUsed.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </Section>
      )}

      {/* ── PROJECTS ── */}
      {resumeData.projects?.visible && Array.isArray(resumeData.projects.data) &&
        resumeData.projects.data.length > 0 && (
        <Section>
          <SectionHeader label="Projects" />
          {(resumeData.projects.data as any[]).map((proj, i) => (
            <View key={i} style={{ marginBottom: 9 }} wrap={false}>
              <View style={shared.row}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                  {proj.title}{proj.role ? ` | ${proj.role}` : ""}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {proj.github && <Link src={proj.github} style={shared.link}>GitHub</Link>}
                  {proj.link && <Link src={proj.link} style={shared.link}>Live</Link>}
                </View>
              </View>
              {proj.technologies && (
                <Text style={[shared.italic, { fontSize: 7.5, color: C.gray500, marginTop: 1 }]}>
                  {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                </Text>
              )}
              <Text style={{ fontSize: 8, color: C.gray700, marginTop: 2, lineHeight: 1.4 }}>
                {proj.description}
              </Text>
              {proj.impact && (
                <Text style={{ fontSize: 8, color: C.gray600, marginTop: 2 }}>{proj.impact}</Text>
              )}
              {Array.isArray(proj.highlights) && proj.highlights.map((h: string, j: number) => (
                <View key={j} style={{ flexDirection: "row", marginTop: 2 }}>
                  <Text style={{ fontSize: 7.5, color: C.gray600, marginRight: 4 }}>–</Text>
                  <Text style={{ fontSize: 7.5, color: C.gray600, flex: 1 }}>{h}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>
      )}

      {/* ── EDUCATION ── */}
      {resumeData.education?.visible && Array.isArray(resumeData.education.data) &&
        resumeData.education.data.length > 0 && (
        <Section>
          <SectionHeader label="Education" />
          {(resumeData.education.data as any[]).map((edu, i) => (
            <View key={i} style={{ marginBottom: 7 }} wrap={false}>
              <View style={shared.row}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                  {edu.degree}{edu.field ? ` – ${edu.field}` : ""}
                </Text>
                <Text style={shared.small}>{edu.startDate} – {edu.endDate}</Text>
              </View>
              <Text style={{ fontSize: 8, color: C.gray600 }}>
                {edu.institution}{edu.location ? ` • ${edu.location}` : ""}
              </Text>
              {edu.grade && (
                <Text style={{ fontSize: 8, color: C.gray600 }}>Grade: {edu.grade}</Text>
              )}
            </View>
          ))}
        </Section>
      )}

      {/* ── SKILLS ── */}
      {resumeData.skills?.visible && typeof resumeData.skills.data === "object" &&
        Object.keys(resumeData.skills.data).length > 0 && (
        <Section>
          <SectionHeader label="Skills" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 0 }}>
            {Object.entries(resumeData.skills.data).map(([cat, skills]) => (
              <View key={cat} style={{ width: "50%", marginBottom: 4, paddingRight: 8 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8 }}>{cat}</Text>
                <Text style={{ fontSize: 8, color: C.gray600, lineHeight: 1.4 }}>
                  {Array.isArray(skills) ? skills.join(", ") : String(skills)}
                </Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {resumeData.certifications?.visible && Array.isArray(resumeData.certifications.data) &&
        resumeData.certifications.data.length > 0 && (
        <Section>
          <SectionHeader label="Certifications" />
          {(resumeData.certifications.data as any[]).map((c, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>{c.name}</Text>
              <Text style={{ fontSize: 8.5, color: C.gray600 }}> • {c.issuer}</Text>
              {c.issueDate && <Text style={{ fontSize: 8, color: C.gray400 }}> ({c.issueDate})</Text>}
            </View>
          ))}
        </Section>
      )}

      {/* ── ACHIEVEMENTS ── */}
      {resumeData.achievements?.visible && Array.isArray(resumeData.achievements.data) &&
        resumeData.achievements.data.length > 0 && (
        <Section>
          <SectionHeader label="Achievements" />
          {(resumeData.achievements.data as any[]).map((a, i) => (
            <View key={i} style={{ marginBottom: 5 }} wrap={false}>
              {typeof a === "string" ? (
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 8, color: C.gray700, marginRight: 4 }}>•</Text>
                  <Text style={{ fontSize: 8, color: C.gray700, flex: 1 }}>{a}</Text>
                </View>
              ) : (
                <>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>{a.title}</Text>
                  {(a.organization || a.date) && (
                    <Text style={{ fontSize: 8, color: C.gray600 }}>
                      {a.organization}{a.date ? ` • ${a.date}` : ""}
                    </Text>
                  )}
                  {a.description && (
                    <Text style={{ fontSize: 8, color: C.gray700, marginTop: 1 }}>{a.description}</Text>
                  )}
                </>
              )}
            </View>
          ))}
        </Section>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MINIMAL TEMPLATE PDF
// ────────────────────────────────────────────────────────────────────────────
function MinimalPDF({ resumeData }: { resumeData: ResumeData }) {
  const personal = resumeData.personal?.data;

  return (
    <>
      {/* ── HEADER ── */}
      {personal && (
        <Section style={{ textAlign: "center", marginBottom: 18 }}>
          <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", textAlign: "center" }}>
            {personal.fullName}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
            {personal.email && <Text style={{ fontSize: 8, color: C.gray600 }}>{personal.email}</Text>}
            {personal.phone && <Text style={{ fontSize: 8, color: C.gray600 }}>  |  {personal.phone}</Text>}
            {personal.linkedin && (
              <Link src={personal.linkedin} style={[shared.link, { fontSize: 8 }]}>  |  LinkedIn</Link>
            )}
          </View>
          <View style={[shared.divider, { marginTop: 10 }]} />
        </Section>
      )}

      {/* Reuse Modern body for Minimal — same data, slightly different header */}
      {resumeData.summary?.visible && resumeData.summary.data && (
        <Section>
          <SectionHeader label="Summary" />
          <Text style={{ fontSize: 9, color: C.gray700, lineHeight: 1.5 }}>
            {resumeData.summary.data as string}
          </Text>
        </Section>
      )}

      {resumeData.experience?.visible && Array.isArray(resumeData.experience.data) &&
        resumeData.experience.data.length > 0 && (
        <Section>
          <SectionHeader label="Experience" />
          {(resumeData.experience.data as any[]).map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }} wrap={false}>
              <View style={shared.row}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>{exp.role}</Text>
                <Text style={shared.small}>{exp.duration}</Text>
              </View>
              <Text style={[shared.italic, { fontSize: 8, color: C.gray600 }]}>
                {exp.company}{exp.location ? ` • ${exp.location}` : ""}
              </Text>
              {Array.isArray(exp.responsibilities) && exp.responsibilities.map((r: string, j: number) => (
                <View key={j} style={{ flexDirection: "row", marginTop: 2 }}>
                  <Text style={{ fontSize: 8, color: C.gray700, marginRight: 4 }}>•</Text>
                  <Text style={{ fontSize: 8, color: C.gray700, flex: 1, lineHeight: 1.4 }}>{r}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>
      )}

      {resumeData.skills?.visible && typeof resumeData.skills.data === "object" && (
        <Section>
          <SectionHeader label="Skills" />
          {Object.entries(resumeData.skills.data).map(([cat, skills]) => (
            <View key={cat} style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, width: 90 }}>{cat}:</Text>
              <Text style={{ fontSize: 8.5, color: C.gray700, flex: 1 }}>
                {Array.isArray(skills) ? skills.join(", ") : String(skills)}
              </Text>
            </View>
          ))}
        </Section>
      )}

      {resumeData.education?.visible && Array.isArray(resumeData.education.data) &&
        resumeData.education.data.length > 0 && (
        <Section>
          <SectionHeader label="Education" />
          {(resumeData.education.data as any[]).map((edu, i) => (
            <View key={i} style={{ marginBottom: 7 }} wrap={false}>
              <View style={shared.row}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                  {edu.degree}{edu.field ? ` – ${edu.field}` : ""}
                </Text>
                <Text style={shared.small}>{edu.startDate} – {edu.endDate}</Text>
              </View>
              <Text style={{ fontSize: 8, color: C.gray600 }}>{edu.institution}</Text>
            </View>
          ))}
        </Section>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CLASSIC TEMPLATE PDF  (sidebar layout)
// ────────────────────────────────────────────────────────────────────────────
function ClassicPDF({ resumeData }: { resumeData: ResumeData }) {
  const personal = resumeData.personal?.data;

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      {/* ── LEFT SIDEBAR ── */}
      <View
        style={{
          width: "33%",
          backgroundColor: C.sidebar,
          paddingRight: 14,
          paddingTop: 2,
        }}
      >
        {personal && (
          <>
            <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: C.gray900 }}>
              {personal.fullName}
            </Text>
            {personal.title && (
              <Text style={{ fontSize: 8, color: C.gray600, marginTop: 2 }}>{personal.title}</Text>
            )}

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, textTransform: "uppercase", color: C.gray700 }}>
                Contact
              </Text>
              <View style={[shared.divider, { marginTop: 3 }]} />
              {personal.email    && <Text style={{ fontSize: 7.5, color: C.gray700, marginTop: 2 }}>{personal.email}</Text>}
              {personal.phone    && <Text style={{ fontSize: 7.5, color: C.gray700, marginTop: 2 }}>{personal.phone}</Text>}
              {personal.location && <Text style={{ fontSize: 7.5, color: C.gray700, marginTop: 2 }}>{personal.location}</Text>}
              {personal.linkedin && (
                <Link src={personal.linkedin} style={[shared.link, { fontSize: 7.5, marginTop: 2 }]}>
                  LinkedIn
                </Link>
              )}
              {personal.github && (
                <Link src={personal.github} style={[shared.link, { fontSize: 7.5, marginTop: 2 }]}>
                  GitHub
                </Link>
              )}
            </View>
          </>
        )}

        {/* Skills in sidebar */}
        {resumeData.skills?.visible && typeof resumeData.skills.data === "object" && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, textTransform: "uppercase", color: C.gray700 }}>
              Skills
            </Text>
            <View style={[shared.divider, { marginTop: 3 }]} />
            {Object.entries(resumeData.skills.data).map(([cat, skills]) => (
              <View key={cat} style={{ marginTop: 5 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5 }}>{cat}</Text>
                <Text style={{ fontSize: 7.5, color: C.gray600, lineHeight: 1.4 }}>
                  {Array.isArray(skills) ? skills.join(", ") : String(skills)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications in sidebar */}
        {resumeData.certifications?.visible && Array.isArray(resumeData.certifications.data) &&
          resumeData.certifications.data.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, textTransform: "uppercase", color: C.gray700 }}>
              Certifications
            </Text>
            <View style={[shared.divider, { marginTop: 3 }]} />
            {(resumeData.certifications.data as any[]).map((c, i) => (
              <View key={i} style={{ marginTop: 5 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5 }}>{c.name}</Text>
                <Text style={{ fontSize: 7, color: C.gray600 }}>{c.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── RIGHT MAIN ── */}
      <View style={{ flex: 1, paddingLeft: 14 }}>
        {resumeData.summary?.visible && resumeData.summary.data && (
          <View style={{ marginBottom: 12 }}>
            <Text style={shared.sectionTitle}>Summary</Text>
            <View style={shared.divider} />
            <Text style={{ fontSize: 8.5, color: C.gray700, lineHeight: 1.5 }}>
              {resumeData.summary.data as string}
            </Text>
          </View>
        )}

        {resumeData.experience?.visible && Array.isArray(resumeData.experience.data) &&
          resumeData.experience.data.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={shared.sectionTitle}>Experience</Text>
            <View style={shared.divider} />
            {(resumeData.experience.data as any[]).map((exp, i) => (
              <View key={i} style={{ marginBottom: 9 }} wrap={false}>
                <View style={shared.row}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>{exp.role}</Text>
                  <Text style={shared.small}>{exp.duration}</Text>
                </View>
                <Text style={[shared.italic, { fontSize: 8, color: C.gray600 }]}>
                  {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                </Text>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.map((r: string, j: number) => (
                  <View key={j} style={{ flexDirection: "row", marginTop: 2 }}>
                    <Text style={{ fontSize: 8, color: C.gray700, marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 8, color: C.gray700, flex: 1, lineHeight: 1.4 }}>{r}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resumeData.projects?.visible && Array.isArray(resumeData.projects.data) &&
          resumeData.projects.data.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={shared.sectionTitle}>Projects</Text>
            <View style={shared.divider} />
            {(resumeData.projects.data as any[]).map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }} wrap={false}>
                <View style={shared.row}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                    {proj.title}{proj.role ? ` | ${proj.role}` : ""}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    {proj.github && <Link src={proj.github} style={shared.link}>GitHub</Link>}
                    {proj.link   && <Link src={proj.link}   style={shared.link}>Live</Link>}
                  </View>
                </View>
                {proj.technologies && (
                  <Text style={[shared.italic, { fontSize: 7.5, color: C.gray500 }]}>
                    {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                  </Text>
                )}
                <Text style={{ fontSize: 8, color: C.gray700, marginTop: 1 }}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {resumeData.education?.visible && Array.isArray(resumeData.education.data) &&
          resumeData.education.data.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={shared.sectionTitle}>Education</Text>
            <View style={shared.divider} />
            {(resumeData.education.data as any[]).map((edu, i) => (
              <View key={i} style={{ marginBottom: 7 }} wrap={false}>
                <View style={shared.row}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                    {edu.degree}{edu.field ? ` – ${edu.field}` : ""}
                  </Text>
                  <Text style={shared.small}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <Text style={{ fontSize: 8, color: C.gray600 }}>
                  {edu.institution}{edu.location ? ` • ${edu.location}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {resumeData.achievements?.visible && Array.isArray(resumeData.achievements.data) &&
          resumeData.achievements.data.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={shared.sectionTitle}>Achievements</Text>
            <View style={shared.divider} />
            {(resumeData.achievements.data as any[]).map((a, i) => (
              <View key={i} style={{ marginBottom: 4 }} wrap={false}>
                {typeof a === "string" ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 8, marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 8, color: C.gray700, flex: 1 }}>{a}</Text>
                  </View>
                ) : (
                  <>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>{a.title}</Text>
                    <Text style={{ fontSize: 8, color: C.gray600 }}>
                      {a.organization}{a.date ? ` • ${a.date}` : ""}
                    </Text>
                    {a.description && (
                      <Text style={{ fontSize: 8, color: C.gray700 }}>{a.description}</Text>
                    )}
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ROOT DOCUMENT  (exported)
// ────────────────────────────────────────────────────────────────────────────
interface ResumePDFDocumentProps {
  resumeData: ResumeData;
  templateId?: string;
}

export default function ResumePDFDocument({
  resumeData,
  templateId = "TemplateModern",
}: ResumePDFDocumentProps) {
  const isClassic = templateId === "TemplateClassic";
  const isMinimal = templateId === "TemplateMinimal";

  return (
    <Document
      title={`${resumeData.personal?.data?.fullName ?? "Resume"} — Resume`}
      author={resumeData.personal?.data?.fullName}
      creator="AIJobSync"
    >
      <Page size="A4" style={shared.page}>
        {isClassic ? (
          <ClassicPDF resumeData={resumeData} />
        ) : isMinimal ? (
          <MinimalPDF resumeData={resumeData} />
        ) : (
          <ModernPDF resumeData={resumeData} />
        )}
      </Page>
    </Document>
  );
}
