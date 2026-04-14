/* eslint-disable @typescript-eslint/no-explicit-any */


// src/lib/linkedin-parser.ts
import {
  Education,
  ExperienceItem,
  Project,
  Certification,
  Achievement,
  CodingProfile,
  Language,
  CoreSkills,
} from "@/types/profileWizard";

interface ExtractedLinkedInData {
  fullName: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: Education[];
  experience: ExperienceItem[];
  projects: Project[];
  coreSkills: CoreSkills;
  softSkills: string[];
  tools: string[];
  certifications: Certification[];
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  languages: Language[];
}

export async function parseLinkedInPDF(
  buffer: Buffer
): Promise<ExtractedLinkedInData> {
  try {
    // Extract text from PDF using pdf-parse v2
    const pdfText = await extractTextFromPDF(buffer);
    // console.log(pdfText, "pdf text");

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("PDF contains no extractable text");
    }

    // console.log("Extracted PDF text length:", pdfText.length);

    // Use Groq to parse and structure the data
    const extractedData = await extractWithGroq(pdfText);

    return extractedData;
  } catch (error) {
    console.error("Error parsing LinkedIn PDF:", error);
    throw new Error(`Failed to parse LinkedIn PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Extract text from PDF using new pdf-parse v2.4.5 (Works with Next.js!)
// Extract text from PDF using pdf-parse v2.4.5
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // console.log("Extracting text from PDF using pdf-parse v2...");

    // Dynamically import to avoid edge runtime issues
    const { PDFParse } = await import('pdf-parse');

    // Create parser instance with buffer data
    const parser = new PDFParse({ data: buffer });
    
    // Extract text from all pages
    const result = await parser.getText();
    
    // Clean up resources
    await parser.destroy();

    // console.log("Successfully extracted text from PDF");
    return result.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Extract data using Groq (FREE)
async function extractWithGroq(pdfText: string): Promise<ExtractedLinkedInData> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not found in environment variables. Please add it to your .env file");
  }

  const prompt = buildExtractionPrompt(pdfText);

  try {
    // console.log("Calling Groq API for data extraction...");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional data extraction assistant. Extract structured data from LinkedIn profiles and return valid JSON only. Do not include any markdown formatting or explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from Groq API");
    }

    const content = data.choices[0].message.content;
    // console.log("Groq API response received, parsing...");

    return parseAIResponse(content);
  } catch (error) {
    console.error("Error with Groq API:", error);
    throw new Error(`Failed to extract data with Groq: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Build extraction prompt
function buildExtractionPrompt(pdfText: string): string {
  return `You are a professional data extraction assistant. Extract structured data from this LinkedIn profile PDF text and return it in JSON format.

LinkedIn Profile Text:
${pdfText}

Extract and structure the following information:

1. Personal Information:
   - fullName (string)
   - phone (string, empty if not available)
   - location (string, city and country)
   - linkedin (string, URL if mentioned)
   - github (string, URL if mentioned)
   - portfolio (string, URL if mentioned)
   - summary (string, professional summary/about section)

2. Education (array of objects):
   - degree (string)
   - field (string, field of study)
   - institution (string)
   - location (string)
   - startDate (string, YYYY-MM format)
   - endDate (string, YYYY-MM format)
   - grade (string, if mentioned)

3. Experience (array of objects):
   - company (string)
   - role (string, job title)
   - location (string)
   - startDate (string, YYYY-MM format)
   - endDate (string, YYYY-MM format or empty if current)
   - currentlyWorking (boolean)
   - responsibilities (string, detailed description)
   - skillsUsed (array of strings)
   - summary (string, brief overview)

4. Projects (array of objects):
   - title (string)
   - description (string)
   - summary (string)
   - technologies (array of strings)
   - liveUrl (string, if available)
   - githubUrl (string, if available)
   - startDate (string, YYYY-MM format)
   - endDate (string, YYYY-MM format)
   - isOngoing (boolean)
   - role (string)
   - teamSize (string)
   - highlights (string)

5. Skills:
   - coreSkills (object with categories as keys and arrays of skills as values, e.g., {"Programming Languages": ["JavaScript", "Python"], "Frameworks": ["React", "Node.js"]})
   - softSkills (array of strings)
   - tools (array of strings)

6. Certifications (array of objects):
   - name (string)
   - issuer (string)
   - issueDate (string, YYYY-MM format)
   - expiryDate (string, if available)
   - credentialId (string)
   - credentialUrl (string)
   - skills (array of strings)
   - description (string)
   - neverExpires (boolean)

7. Achievements (array of objects):
   - title (string)
   - description (string)
   - date (string, YYYY-MM format)
   - category (string, e.g., "Award", "Recognition", "Publication")
   - organization (string)
   - location (string)
   - recognition (string)
   - impact (string)

8. Coding Profiles (array of objects):
   - platform (string, e.g., "LeetCode", "HackerRank", "CodeChef")
   - username (string)
   - url (string)

9. Languages (array of objects):
   - name (string)
   - proficiency (string, e.g., "Native", "Fluent", "Professional", "Limited")

Important Instructions:
- Parse dates carefully and convert to YYYY-MM format (use "01" for month if only year is available)
- If a field is not available, use empty string "" for strings, empty array [] for arrays, or false for booleans
- For currentlyWorking in experience, check if endDate mentions "Present", "Current" or is missing
- Extract all skills mentioned and categorize them appropriately in coreSkills object
- Be thorough in extracting responsibilities and descriptions
- Infer missing information intelligently based on context
- DO NOT include any markdown formatting like \`\`\`json or \`\`\`
- Return ONLY a valid JSON object, nothing else

Example output structure:
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "portfolio": "https://johndoe.com",
  "summary": "Experienced software engineer...",
  "education": [
    {
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "institution": "Stanford University",
      "location": "Stanford, CA",
      "startDate": "2015-09",
      "endDate": "2019-06",
      "grade": "3.8 GPA"
    }
  ],
  "experience": [],
  "projects": [],
  "coreSkills": {
    "Programming Languages": ["JavaScript", "Python"],
    "Frameworks": ["React", "Node.js"]
  },
  "softSkills": ["Leadership", "Communication"],
  "tools": ["Git", "Docker"],
  "certifications": [],
  "achievements": [],
  "codingProfiles": [],
  "languages": [
    {
      "name": "English",
      "proficiency": "Native"
    }
  ]
}

Now extract the data from the provided LinkedIn profile text and return only the JSON object.`;
}

// Parse AI response
function parseAIResponse(content: string): ExtractedLinkedInData {
  try {
    // Extract JSON from response
    let jsonText = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "").replace(/```\n?$/g, "");
    }

    // Parse JSON
    const parsedData = JSON.parse(jsonText);

    // Validate and return data with proper defaults
    return {
      fullName: parsedData.fullName || "",
      phone: parsedData.phone || "",
      location: parsedData.location || "",
      linkedin: parsedData.linkedin || "",
      github: parsedData.github || "",
      portfolio: parsedData.portfolio || "",
      summary: parsedData.summary || "",
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
      coreSkills: parsedData.coreSkills && typeof parsedData.coreSkills === 'object' ? parsedData.coreSkills : {},
      softSkills: Array.isArray(parsedData.softSkills) ? parsedData.softSkills : [],
      tools: Array.isArray(parsedData.tools) ? parsedData.tools : [],
      certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
      achievements: Array.isArray(parsedData.achievements) ? parsedData.achievements : [],
      codingProfiles: Array.isArray(parsedData.codingProfiles) ? parsedData.codingProfiles : [],
      languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error("AI response content:", content.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
  }
}