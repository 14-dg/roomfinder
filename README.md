
# 📘 Using AI in This Project (SYP-Compliant Workflow)

The use of generative AI is allowed in this project, but all AI-generated source code must be clearly attributable in the Git history. To ensure clean separation between human-written and AI-generated code, we use a dedicated **Git worktree** and a special AI author identity.

This document explains how to set up and use the AI worktree.

---

## 🚀 1. Purpose

According to the SYP guidelines:

* Small autocomplete suggestions may be committed normally.
* Larger changes generated through prompting must be committed under a  **special AI author** .
* Students must always be able to explain all code that appears under their own name.

To support this workflow, a separate Git worktree named `ai` is used exclusively for AI-generated modifications.

---

## 🛠️ 2. Setup Instructions

Perform the following steps once during project setup.

### **Step 1 — Navigate into the main repository**

```bash
cd team11
```

*(Replace `team11` with your actual repository directory if necessary.)*

### **Step 2 — Enable worktree-specific Git configuration**

```bash
git config extensions.worktreeConfig true
```

### **Step 3 — Create the AI worktree**

```bash
git worktree add ../ai
```

This creates a second working directory:

* `team11/` — your normal workspace (branch: `master`)
* `ai/` — the AI workspace (branch: `ai`)

### **Step 4 — Configure the AI author identity**

Switch into the AI worktree:

```bash
cd ../ai
```

Set the required author identity:

```bash
git config --worktree user.name "AI"
git config --worktree user.email "aisyp@woerzberger.de"
```

⚠️ **Use these exact values.**

They correspond to a special GitLab user added to this project.

---

## 📂 3. How to Work With the Two Worktrees

### **Human-written code (normal development)**

Work in:

```
team11/  (branch: master)
```

Your commits will use your personal Git identity.

---

### **AI-generated code**

Work in:

```
ai/  (branch: ai)
```

Any file changes made here—whether by ChatGPT, IDE assistants, or other tools—must be committed using the AI author:

```bash
git add .
git commit -m "AI: <description>"
```

The commit will automatically use:

```
Author: AI <aisyp@woerzberger.de>
```

---

## 🔄 4. Merging Changes

### **Merge AI changes into master**

From the main repository:

```bash
cd ../team11
git merge ai
```

### **Update the AI worktree with recent master changes**

```bash
cd ../ai
git merge master
```

This keeps both worktrees synchronized.

---

## 🧪 5. Responsibilities

Even though AI produces code, **each team member remains fully responsible** for understanding and maintaining any code in the areas they own (as defined in `projekt/02_verantwortungsbereiche.asciidoc`).

---

## ✔️ 6. Summary

* Human code → commit in `team11/`
* AI code → commit in `ai/` using the AI author
* Merge between branches as needed
* Ensures auditability via `git blame`
* Fully compliant with SYP requirements
