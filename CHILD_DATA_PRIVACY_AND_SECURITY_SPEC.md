# CHILD DATA PRIVACY AND SECURITY SPECIFICATION
**Document ID:** GPL-SPEC-PRIVACY-V1  
**Project:** Gramin PocketLab — K–12 Multi-Board Learning Ecosystem  
**Target Audience:** Security Engineers, Data Protection Officers, Compliance Auditors, Full-Stack Architects  
**Status:** Draft — Task v6 Security, Validation & Evidence Reconciliation Completed
**Classification:** Privacy Architecture, Threat Modeling & Regulatory Release Gate Specification  

---

## 1. Regulatory Context & Core Privacy Principles

Gramin PocketLab is architected for school students across Classes 5–12 in India. Protecting children's digital safety, psychological well-being, and data sovereignty is an uncompromising prerequisite.

> [!WARNING]
> **Regulatory Release Gate Notice:**
> Formal legal compliance under India's **Digital Personal Data Protection (DPDP) Act, 2023** and relevant state child-protection guidelines represents a mandatory pre-launch release gate. This document defines the technical privacy architecture designed to satisfy these standards. **No marketing claim of "certified compliance" is permitted** until a formal qualified legal and data protection audit has been executed.

### 1.1 Legal Framework & DPDP Act 2023 Commencement Timeline

The regulatory posture of Gramin PocketLab is grounded in the official statutory notifications of the **Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)** and the **Digital Personal Data Protection Rules, 2025**:

1. **Statutory Definition of "Child" (Commenced 13 November 2025):**
   - Under **Section 2(f)** of the DPDP Act 2023, brought into force on **13 November 2025** via Official Gazette notification **G.S.R. 843(E)**:
     > *"child" means an individual who has not completed eighteen years of age.*
   - Students under 18 years of age are classified as child learners. Processing of a child's personal data requires verifiable parental or legal guardian consent.
2. **Adult Learner Pathway (18 Years of Age and Above):**
   - Students in Class 12 or adult learners who have completed eighteen years of age exercise independent legal self-consent.
3. **Scheduled Commencement of Operational Obligations (13 May 2027):**
   - The substantive processing provisions of **Section 9** (*Processing of personal data of children*), along with Sections 3 through 17 and Rules 3 and 5 through 16 of the DPDP Rules, 2025, are scheduled for commencement eighteen (18) months following the initial notification date: **13 May 2027**.
4. **Voluntary Platform Safeguards Adopted in Advance:**
   - Gramin PocketLab proactively adopts the child-protective principles of Section 9 (prohibition of behavioral tracking, prohibition of targeted advertising, local-first data processing, and parental transparency) as **voluntary platform architectural safeguards** in advance of formal statutory commencement.
5. **Mandatory Legal Review Disclaimer:**
   - This specification represents an architectural design baseline and technical proposal. It does **not** constitute formal legal advice or statutory compliance certification. A formal legal review by qualified counsel is mandatory prior to production commercial deployment.

### 1.2 Core Privacy-by-Design & Data Minimization Principles
1. **Local-First by Default:** All learning activities, timetables, assessments, and concept evidence records reside strictly inside local browser storage. Zero network connectivity or account creation is required to use the platform.
2. **Data Minimization (Removal of Unsupported Complete Anonymity Claims):** Student learning records, school names, timetables, and assessment marks constitute linkable personal data. The platform minimizes data collection rather than making untenable absolute anonymity claims:
   - Profiles default to locally generated random alphanumeric pseudonyms (e.g., `Learner_7X9A`).
   - No phone numbers, email addresses, biometric identifiers, school admission numbers, or government IDs (Aadhaar, UDISE) are required for core learning.
   - Optional guardian contact fields (phone for SMS OTP, email for account recovery) are restricted to parental notification workflows, with explicit retention and deletion rules.
3. **Prohibition of Commercial Exploitation:** Student learning histories and interaction data are **never** sold, rented, monetized, or utilized to train general external artificial intelligence models.
4. **Legally Grounded Role Separation:** Teachers, school staff, and mentors are educators—they are **never** treated as legal guardians capable of granting legal data consent on behalf of a minor child under Section 9.

---

## 2. Privacy-by-Design Data Architecture & Entity Schemas (§10.0)

Every data entity in Gramin PocketLab is profile-partitioned, cryptographically bound to a local pseudonym, and strictly typed.

```typescript
// Explicit Separation of Legal Roles
export type LegalConsentRole = 
  | 'biological_or_adoptive_parent' // Authorized legal parent
  | 'court_appointed_legal_guardian'// Legally recognized guardian
  | 'adult_learner_self';           // Self-consent (Learner has completed 18 years)

export type EducationalRole =
  | 'school_teacher'                // Educator (Instructional guidance only; cannot grant legal consent)
  | 'school_head_or_admin'          // Institutional coordinator
  | 'peer_mentor';

export interface GuardianConsentRecord {
  consentId: string;
  learnerProfileId: string;
  consentingRole: LegalConsentRole;
  isLearnerUnder18: boolean;         // True if age < 18; False if adult learner
  consentGrantedScope: {
    allowOptionalCloudBackup: boolean;
    allowAICompanionQueries: boolean;
    allowMultiDeviceSync: boolean;
  };
  consentTimestamp: number;
  verificationMethod: 'sms_otp_guardian' | 'in_app_passcode' | 'signed_guardian_token' | 'self_attestation_adult';
  consentHashSha256: string;
}

export interface SyncState {
  profileId: string;
  lastSuccessfulSyncTimestamp: number;
  clientVectorClock: Record<string, number>;
  pendingOfflineChangesCount: number;
  syncConflictStrategy: 'client_wins_recent' | 'server_merge_prompt' | 'manual_review';
}

export interface ExportRecord {
  exportId: string;
  profileId: string;
  exportedAtTimestamp: number;
  exportFormat: 'json_encrypted' | 'json_plain' | 'csv_tabular';
  checksumSha256: string;
}

export interface DeletionRequest {
  requestId: string;
  profileId: string;
  requestTimestamp: number;
  purgeScheduledTimestamp: number;
  isPurgeCompleted: boolean;
}
```

---

## 3. Cryptographic Architecture & Threat Model

> [!CAUTION]
> **Honest Cryptographic Distinctions:**
> Educational specifications must not conflate server-managed encryption with client-derived zero-knowledge encryption:
> - **Server-Side Encryption (KMS):** Data is encrypted at rest in cloud databases using provider keys (e.g. AWS KMS / Google Cloud KMS). While protecting against physical disk theft, the server infrastructure has access to decryption keys. This is **not** zero-knowledge against the service operator.
> - **Client-Derived Zero-Knowledge Encryption:** Data is encrypted on the client device using an encryption key derived via PBKDF2/Argon2 from a student/guardian secret passphrase. The server receives only opaque ciphertext blobs and possesses zero mathematical ability to decrypt records. (Trade-off: If the secret passphrase is lost, data recovery is mathematically impossible).

### 3.1 Architectural Encryption Alternatives & Recommended Approach

```
+---------------------------------------------------------------------------------------------------+
| COMPARISON OF STORAGE & SYNC SECURITY ARCHITECTURES                                              |
+------------------------------------+--------------------------------+-----------------------------+
| Feature                            | Option A: Server KMS Vault     | Option B: Client ZK Vault   |
+------------------------------------+--------------------------------+-----------------------------+
| Key Custody                        | Cloud Provider (AWS / GCP KMS) | Client Device (Web Crypto)  |
| Zero-Knowledge against Service     | NO (Server can decrypt)        | YES (Server sees ciphertext)|
| Account Recovery on Passphrase Loss| Supported via Guardian Email   | Mathematically Impossible   |
| Regulatory Assessment Complexity   | Standard Cloud Data Processor  | Privacy-by-Design Best-in-Cl|
+------------------------------------+--------------------------------+-----------------------------+
| GRAMIN POCKETLAB HYBRID APPROACH: Local-First Default (Zero Network). If optional cloud sync is    |
| activated, user explicitly chooses: Standard Managed Backup (Option A) OR Private Vault (Option B)|
+---------------------------------------------------------------------------------------------------+
```

### 3.2 Memory Lifecycle & Deletion Limitations
1. **Volatile Memory Sanitization Limitations:** In standard JavaScript runtime environments (V8, JavaScriptCore), memory management relies on non-deterministic garbage collection. Calling `delete` or re-assigning variables does **not** guarantee an instantaneous zero-overwrite of sensitive plaintext strings in physical RAM.
2. **Defensive Deletion Tiers:**
   - *Application-Level Logical Deletion:* Active session references are immediately dereferenced and nullified in memory.
   - *Local Storage Cleanup:* IndexedDB stores and localStorage partitions under `gpl_prof_${profileId}_*` are permanently dropped using `IDBFactory.deleteDatabase()`.
   - *Cryptographic Key Erasure:* In encrypted vaults, the local master key is overwritten and shredded, rendering residual ciphertext permanently indecipherable.
   - *Cloud Partition Purging:* On cloud sync endpoints, soft-delete tombstone records expire and undergo permanent physical row purging within 30 days, matching automated backup rotation windows.

---

## 4. External AI Interaction & Data Minimization Guardrails

When a student queries the **AI Study Companion**, strict automated sanitization filters execute before any prompt touches an external inference endpoint:

```mermaid
flowchart LR
    A[Student Query / Problem Context] --> B[Client-Side Data Minimization Filter]
    B --> C[Strip Identifiers: Names, School Terms, Geographic Tags]
    C --> D[Attach Abstract Curriculum Coordinates (Subject, Class, Chapter, Topic)]
    D --> E[Attach Anonymized Misconception ID]
    E --> F[Send Minimized Payload via TLS 1.3 to AI Gateway]
    F --> G[External Foundation Model (Mandatory Enterprise ZDR Contract)]
    G --> H[Socratic Guidance Response Received]
    H --> I[Present Conceptual Clue to Student in Local Stage]
```

### 4.1 Strict External AI Vendor Requirements
1. **Mandatory Enterprise Zero-Data-Retention (ZDR):** The platform connects only to AI API providers that legally guarantee zero retention of inference logs and contractually prohibit using prompt payloads to train foundation models.
2. **Data Minimization Envelope:** Prompts contain only pedagogical coordinates (`subjectCode`, `classGrade`, `topicId`, `misconceptionId`). Student profile IDs, local names, school labels, schedules, and past test marks are **never** transmitted.
3. **No General Anonymization Guarantee:** Regex-based scrubbing cannot guarantee 100% semantic de-identification in complex conversational queries. Therefore, unscripted free-text chat is restricted in Class 5; younger learners interact via structured Socratic action chips.

---

## 5. Privacy & Security Acceptance Criteria

The following testable criteria define the security baseline. Each item is strictly classified by its current implementation status:

| Criterion ID | Functional Security & Privacy Requirement | Expected Observable Behavior | Technical Status |
| :---: | :--- | :--- | :---: |
| **SEC-01** | **Local Profile Storage Isolation** | In-browser queries from Profile A cannot read or modify IndexedDB records scoped under Profile B's key prefix. | `Specified` |
| **SEC-02** | **One-Click Local Profile Purging** | Invoking "Delete Profile" completely clears all corresponding IndexedDB databases, localStorage keys, and ServiceWorker caches. | `Specified` |
| **SEC-03** | **Machine-Readable Data Export** | Invoking "Export Data" produces an unencrypted or passphrase-encrypted JSON file containing all learner history without network access. | `Specified` |
| **SEC-04** | **Adult Learner Self-Consent** | Learners aged 18+ can independently authorize cloud sync without requiring guardian OTP verification. | `Specified` |
| **SEC-05** | **Guardian Role Separation** | Teachers and mentors cannot authorize cloud sync or AI data transmission for a minor student. | `Specified` |
| **SEC-06** | **AI Query Data Minimization** | Network inspect tool confirms outgoing AI requests contain zero student names, profile IDs, school names, or timestamps. | `Specified` |
| **SEC-07** | **Zero-Network Learning Core** | In Airplane Mode with browser cache populated, all QuestionWorlds and study schedules execute with zero network errors. | `Implemented & Verified` |
| **SEC-08** | **Zero Third-Party Telemetry** | Network inspection confirms zero analytics beacons, advertising trackers, or telemetry scripts run during learning sessions. | `Implemented & Verified` |
