# Development Setup & Quick Start Guide

## ⚙️ Prerequisites

To run and build the application, **Node.js (LTS version)** is required.

### 1. Installing Node.js on Windows

You have two easy ways to install Node.js:

#### Option A: Via Official Installer (Recommended & Quick)
1. Visit the official website: [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** installer (e.g., v20.x or v22.x Windows `.msi`).
3. Run the installer, keep default settings, and click **Finish**.
4. Restart your terminal / PowerShell.

#### Option B: Via Windows Package Manager (PowerShell / Command Prompt)
Run the following command in PowerShell:
```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```
*Note: After installation finishes, close and reopen your PowerShell or IDE so the updated PATH is picked up.*

---

## 🔍 Verification
To verify that Node.js and npm are ready, open PowerShell and run:
```powershell
node -v
npm -v
git --version
```
Expected output:
- `node`: `v20.x.x` or `v22.x.x`
- `npm`: `10.x.x`
- `git`: `git version 2.x.x`

---

## 🚀 What to do in the New Session
When you start the next session, simply tell the assistant:
> *"मैंने प्लानिंग फ़ोल्डर देख लिया है, अब Phase 1 से शुरू करते हैं और ऐप बनाना स्टार्ट करते हैं।"*
*(Or: "Start executing the plan in the planning folder")*

The assistant will immediately:
1. Initialize the Expo React Native project configured for Web and Mobile.
2. Setup the folder structure and install required libraries (Lucide, AsyncStorage, Firebase).
3. Build the Games Hub, Call Break rules guide, player selection, and live scoring engine.
