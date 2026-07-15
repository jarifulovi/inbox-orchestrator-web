// Dummy data matching the backend data structures:
// - Thread from email_threads + get_user_threads response shape
// - ThreadEmail from emails table with email_facts(*) join
// - EmailFact from email_facts table schema

import { Thread } from "@/features/inbox/types";

export type EmailFact = {
  id: string;
  email_id: string;
  fact_type: "task" | "commitment" | "decision" | "question" | "fact";
  payload: {
    action?: string;
    actor?: string;
    target?: string;
    deadline?: string | null;
    confidence?: number;
  };
  source_sentence: string;
  created_at: string;
};

export type ThreadEmail = {
  id: string;
  thread_id: string;
  gmail_message_id: string;
  sender: string;
  sender_name: string;
  recipients: string[];
  cc: string[];
  subject: string;
  body: string;
  snippet: string;
  received_at: string;
  category: string;
  ai_metadata: {
    classifier?: { label_id: number; confidence: number };
    security_analysis?: { security_trust_level: string; pre_security_passed: boolean };
    fact_extraction?: { processed: boolean };
  };
  email_facts: EmailFact[];
};

import { Task } from "@/features/tasks/types";

export type ThreadDetail = {
  thread: Thread;
  emails: ThreadEmail[];
  tasks: Task[];
};

// ─── Dummy Thread List ────────────────────────────────────────────────────────

export const DUMMY_THREADS: Thread[] = [
  {
    id: "thread-001",
    subject: "Q3 Product Roadmap Review",
    sender_name: "Sarah Chen",
    sender_email: "sarah.chen@techcorp.io",
    preview: "Hi team, I've attached the updated roadmap for Q3. Please review the milestone breakdown...",
    summary:
      "Sarah Chen shared the Q3 product roadmap and requested review of milestone breakdowns. The team needs to confirm availability for the planning session scheduled for next Friday.",
    priority: "high",
    workflow_status: "needs_action",
    security_trust_level: "trusted",
    tasks_count: 3,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    unread: true,
    message_count: 4,
    account_email: "you@example.com",
  },
  {
    id: "thread-002",
    subject: "Invoice #4821 — Due July 30",
    sender_name: "Billing Team",
    sender_email: "billing@vendors.com",
    preview: "Your invoice for services rendered in June is now available. Amount due: $2,400...",
    summary:
      "An invoice of $2,400 for June services is due on July 30. No action has been taken yet.",
    priority: "medium",
    workflow_status: "needs_action",
    security_trust_level: "neutral",
    tasks_count: 1,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unread: true,
    message_count: 1,
    account_email: "you@example.com",
  },
  {
    id: "thread-003",
    subject: "Re: Design System Tokens Update",
    sender_name: "Marcus Reid",
    sender_email: "marcus@design.team",
    preview: "Thanks for the PR! Left a few comments on the spacing tokens. Once those are addressed...",
    summary:
      "Marcus left review comments on a design system PR. Spacing tokens need to be addressed before the PR can be merged.",
    priority: "medium",
    workflow_status: "awaiting_reply",
    security_trust_level: "trusted",
    tasks_count: 2,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unread: false,
    message_count: 3,
    account_email: "you@example.com",
  },
  {
    id: "thread-004",
    subject: "Team Offsite Planning — August",
    sender_name: "HR Team",
    sender_email: "hr@company.com",
    preview: "We're planning a team offsite for the week of August 18. Please fill in your availability...",
    summary:
      "HR is coordinating a team offsite for August 18. All team members need to fill in their availability by end of week.",
    priority: "low",
    workflow_status: "follow_up",
    security_trust_level: "trusted",
    tasks_count: 1,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    message_count: 2,
    account_email: "you@example.com",
  },
  {
    id: "thread-005",
    subject: "Security Alert: New sign-in detected",
    sender_name: "Google Security",
    sender_email: "no-reply@accounts.google.com",
    preview: "A new sign-in to your Google Account was detected from Chrome on Windows...",
    summary: "Google detected a new sign-in from Chrome on Windows. Verify if this was you.",
    priority: "high",
    workflow_status: "needs_action",
    security_trust_level: "suspicious",
    tasks_count: 0,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unread: true,
    message_count: 1,
    account_email: "you@example.com",
  },
  {
    id: "thread-006",
    subject: "Monthly Newsletter — July 2025",
    sender_name: "Product Updates",
    sender_email: "newsletter@product.io",
    preview: "Check out what's new in July: faster builds, improved search, and dark mode...",
    summary: "Monthly newsletter with product updates including performance improvements and new features.",
    priority: "low",
    workflow_status: "informational",
    security_trust_level: "neutral",
    tasks_count: 0,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    message_count: 1,
    account_email: "you@example.com",
  },
];

// ─── Dummy Thread Details ────────────────────────────────────────────────────

export const DUMMY_THREAD_DETAILS: Record<string, ThreadDetail> = {
  "thread-001": {
    thread: DUMMY_THREADS[0],
    emails: [
      {
        id: "email-001-a",
        thread_id: "thread-001",
        gmail_message_id: "msg_abc001",
        sender: "sarah.chen@techcorp.io",
        sender_name: "Sarah Chen",
        recipients: ["you@example.com", "dev-team@example.com"],
        cc: [],
        subject: "Q3 Product Roadmap Review",
        snippet: "Hi team, I've attached the updated roadmap for Q3...",
        body: `Hi team,

I've attached the updated roadmap for Q3. Please review the milestone breakdown and the dependency graph for the new infrastructure work.

Key highlights:
- Week 1–2: API gateway migration
- Week 3–4: Frontend component library upgrade
- Week 5–6: Performance benchmarking and optimization pass

We need everyone to confirm availability for the planning session next Friday at 2PM. Please block your calendars.

Also, can you review the attached risk register and flag any blockers you foresee?`,
        received_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: "work",
        ai_metadata: {
          classifier: { label_id: 1, confidence: 0.94 },
          security_analysis: { security_trust_level: "trusted", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [
          {
            id: "fact-001",
            email_id: "email-001-a",
            fact_type: "task",
            payload: { action: "review", target: "roadmap milestone breakdown", actor: "recipient", deadline: null, confidence: 0.91 },
            source_sentence: "Please review the milestone breakdown and the dependency graph for the new infrastructure work.",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "fact-002",
            email_id: "email-001-a",
            fact_type: "task",
            payload: { action: "confirm", target: "availability for planning session", actor: "recipient", deadline: "next Friday 2PM", confidence: 0.88 },
            source_sentence: "We need everyone to confirm availability for the planning session next Friday at 2PM.",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "fact-003",
            email_id: "email-001-a",
            fact_type: "task",
            payload: { action: "review", target: "risk register", actor: "recipient", deadline: null, confidence: 0.85 },
            source_sentence: "Can you review the attached risk register and flag any blockers you foresee?",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: "email-001-b",
        thread_id: "thread-001",
        gmail_message_id: "msg_abc002",
        sender: "alex@example.com",
        sender_name: "Alex Kumar",
        recipients: ["sarah.chen@techcorp.io", "dev-team@example.com"],
        cc: [],
        subject: "Re: Q3 Product Roadmap Review",
        snippet: "Sarah, the roadmap looks solid. I have a concern about the API gateway timeline...",
        body: `Sarah, the roadmap looks solid overall.

I have a concern about the API gateway migration timeline — 2 weeks feels tight given the auth service dependencies. Should we build in a buffer?

I'll review the risk register today and send my comments by EOD.

Can we also discuss the frontend component upgrade scope? Last time I checked, we had some breaking changes in the design token layer that need a migration guide.`,
        received_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "work",
        ai_metadata: {
          classifier: { label_id: 1, confidence: 0.89 },
          security_analysis: { security_trust_level: "trusted", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [
          {
            id: "fact-004",
            email_id: "email-001-b",
            fact_type: "commitment",
            payload: { action: "review", target: "risk register", actor: "sender", deadline: "EOD", confidence: 0.92 },
            source_sentence: "I'll review the risk register today and send my comments by EOD.",
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "fact-005",
            email_id: "email-001-b",
            fact_type: "question",
            payload: { action: "discuss", target: "frontend component upgrade scope", actor: "sender", deadline: null, confidence: 0.83 },
            source_sentence: "Can we also discuss the frontend component upgrade scope?",
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: "email-001-c",
        thread_id: "thread-001",
        gmail_message_id: "msg_abc003",
        sender: "sarah.chen@techcorp.io",
        sender_name: "Sarah Chen",
        recipients: ["alex@example.com", "dev-team@example.com"],
        cc: [],
        subject: "Re: Q3 Product Roadmap Review",
        snippet: "Great feedback Alex. I've added 3 days buffer for the API gateway. Let's sync Friday.",
        body: `Great feedback Alex.

I've added a 3-day buffer to the API gateway migration phase. The revised timeline is now 2.5 weeks.

Let's sync on Friday to go over the component library concerns together. I'll set up a calendar invite for 30 minutes before the main planning session.

Can you share the list of breaking changes you've identified in the design token layer so I can share it with the design team beforehand?`,
        received_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        category: "work",
        ai_metadata: {
          classifier: { label_id: 1, confidence: 0.91 },
          security_analysis: { security_trust_level: "trusted", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [
          {
            id: "fact-006",
            email_id: "email-001-c",
            fact_type: "task",
            payload: { action: "share", target: "list of breaking changes in design token layer", actor: "recipient", deadline: "before Friday", confidence: 0.87 },
            source_sentence: "Can you share the list of breaking changes you've identified in the design token layer so I can share it with the design team beforehand?",
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-001",
        title: "Review Q3 milestone breakdown and dependency graph",
        priority: "high",
        status: "pending",
        intent_label: "review_document",
        due_date: null,
        source_thread_id: "thread-001",
        source_thread_subject: "Q3 Product Roadmap Review",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-002",
        title: "Confirm availability for planning session",
        priority: "medium",
        status: "pending",
        intent_label: "schedule_meeting",
        due_date: "2025-08-01T14:00:00.000Z",
        source_thread_id: "thread-001",
        source_thread_subject: "Q3 Product Roadmap Review",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-003",
        title: "Review attached risk register and flag blockers",
        priority: "medium",
        status: "pending",
        intent_label: "review_document",
        due_date: null,
        source_thread_id: "thread-001",
        source_thread_subject: "Q3 Product Roadmap Review",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-004",
        title: "Share list of breaking changes in design token layer",
        priority: "low",
        status: "pending",
        intent_label: "provide_information",
        due_date: null,
        source_thread_id: "thread-001",
        source_thread_subject: "Q3 Product Roadmap Review",
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-005",
        title: "Initial draft of gateway timeline adjustment",
        priority: "medium",
        status: "completed",
        intent_label: "follow_up",
        due_date: null,
        source_thread_id: "thread-001",
        source_thread_subject: "Q3 Product Roadmap Review",
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },

  "thread-002": {
    thread: DUMMY_THREADS[1],
    emails: [
      {
        id: "email-002-a",
        thread_id: "thread-002",
        gmail_message_id: "msg_bcd001",
        sender: "billing@vendors.com",
        sender_name: "Billing Team",
        recipients: ["you@example.com"],
        cc: [],
        subject: "Invoice #4821 — Due July 30",
        snippet: "Your invoice for services rendered in June is now available. Amount due: $2,400...",
        body: `Dear Customer,

Your invoice for services rendered in June 2025 is now available.

Invoice #4821
Amount Due: $2,400.00
Due Date: July 30, 2025

Payment Methods:
- Bank Transfer: IBAN XX00 0000 0000 0000
- Credit Card: Pay online at vendors.com/pay

Please ensure payment is made by the due date to avoid late fees.`,
        received_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "finance",
        ai_metadata: {
          classifier: { label_id: 3, confidence: 0.95 },
          security_analysis: { security_trust_level: "neutral", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [
          {
            id: "fact-007",
            email_id: "email-002-a",
            fact_type: "task",
            payload: { action: "pay", target: "Invoice #4821 — $2,400", actor: "recipient", deadline: "July 30, 2025", confidence: 0.96 },
            source_sentence: "Please ensure payment is made by the due date to avoid late fees.",
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-006",
        title: "Pay Invoice #4821 — $2,400",
        priority: "medium",
        status: "pending",
        intent_label: "make_payment",
        due_date: "2025-07-30T23:59:59.000Z",
        source_thread_id: "thread-002",
        source_thread_subject: "Invoice #4821 — Due July 30",
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },

  "thread-003": {
    thread: DUMMY_THREADS[2],
    emails: [
      {
        id: "email-003-a",
        thread_id: "thread-003",
        gmail_message_id: "msg_cde001",
        sender: "you@example.com",
        sender_name: "You",
        recipients: ["marcus@design.team"],
        cc: [],
        subject: "Design System Tokens Update",
        snippet: "Hey Marcus, I've pushed a PR for the spacing tokens refactor. Mind taking a look?",
        body: `Hey Marcus,

I've pushed a PR for the spacing tokens refactor. The main changes are:
- Unified the spacing scale from 4px to 8px base
- Added semantic tokens for component-level spacing
- Updated all existing Tailwind utilities to reference the new tokens

Mind taking a look when you get a chance? There are a few decisions I wasn't sure about in the motion/transition tokens section.`,
        received_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: "work",
        ai_metadata: {
          classifier: { label_id: 1, confidence: 0.88 },
          security_analysis: { security_trust_level: "trusted", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [],
      },
      {
        id: "email-003-b",
        thread_id: "thread-003",
        gmail_message_id: "msg_cde002",
        sender: "marcus@design.team",
        sender_name: "Marcus Reid",
        recipients: ["you@example.com"],
        cc: [],
        subject: "Re: Design System Tokens Update",
        snippet: "Thanks for the PR! Left a few comments on the spacing tokens. Once those are addressed...",
        body: `Thanks for the PR! Great work on the semantic token layer.

Left a few comments on the spacing tokens — mainly around the 'space-component-lg' value which I think should be 24px not 20px to match our existing card padding.

Once those are addressed, I'll approve and merge. Also, should we add a CHANGELOG entry for this?

Two tasks for you:
1. Fix the space-component-lg value to 24px
2. Add a CHANGELOG entry before I approve`,
        received_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: "work",
        ai_metadata: {
          classifier: { label_id: 1, confidence: 0.91 },
          security_analysis: { security_trust_level: "trusted", pre_security_passed: true },
          fact_extraction: { processed: true },
        },
        email_facts: [
          {
            id: "fact-008",
            email_id: "email-003-b",
            fact_type: "task",
            payload: { action: "fix", target: "space-component-lg value to 24px", actor: "recipient", deadline: null, confidence: 0.93 },
            source_sentence: "Fix the space-component-lg value to 24px",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "fact-009",
            email_id: "email-003-b",
            fact_type: "task",
            payload: { action: "add", target: "CHANGELOG entry", actor: "recipient", deadline: null, confidence: 0.89 },
            source_sentence: "Add a CHANGELOG entry before I approve",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-007",
        title: "Fix space-component-lg value to 24px",
        priority: "high",
        status: "pending",
        intent_label: "follow_up",
        due_date: null,
        source_thread_id: "thread-003",
        source_thread_subject: "Design System Tokens Update",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-008",
        title: "Add CHANGELOG entry",
        priority: "medium",
        status: "pending",
        intent_label: "follow_up",
        due_date: null,
        source_thread_id: "thread-003",
        source_thread_subject: "Design System Tokens Update",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
};
