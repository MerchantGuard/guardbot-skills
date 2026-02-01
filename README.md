# GuardBot Skills

**Compliance passports for AI agents**

GuardBot is the compliance layer for the AI agent economy. Get verified, get a passport, move money.

## Quick Start

```bash
npx @guardbot/skills
```

Or install globally:

```bash
npm install -g @guardbot/skills
guardbot score --wallet 0x...
```

## What This Does

1. **Audit** your agent's installed skills for security vulnerabilities
2. **Calculate** your Agent-Ready Score (0-110)
3. **Issue** a W3C Verifiable Credential compliance passport
4. **Mint** an on-chain attestation on Base L2

## Commands

### Check Your Score

```bash
guardbot score --wallet <YOUR_WALLET_ADDRESS>
```

Returns:
```json
{
  "agent_ready_score": 85,
  "trust_tier": "Gold",
  "risk_level": "standard",
  "capabilities": {
    "mastercard_agent_pay": true,
    "visa_stablecoin": true
  }
}
```

### Security Audit

```bash
guardbot audit
```

Scans your skills directory for:
- Sensitive path access (~/.ssh, ~/.env, API keys)
- Unsigned skill sources
- Known malicious patterns
- Prompt injection vulnerabilities

### Get Your Passport

```bash
guardbot passport --wallet <WALLET> --name <AGENT_NAME>
```

Issues a W3C Verifiable Credential that PSPs can verify.

### Mint On-Chain

```bash
guardbot mint --wallet <WALLET>
```

Creates a permanent Base L2 attestation. Cost: ~0.001 ETH (gas only).

## Trust Tiers

| Tier | Score | Capabilities |
|------|-------|--------------|
| Bronze | 30-59 | Basic wallet ops |
| Silver | 60-89 | Visa Tap to Pay |
| Gold | 90-100 | Mastercard Agent Pay |
| Platinum | 101-110 | All protocols + priority |

## MCP Server

Add to your Claude desktop config:

```json
{
  "mcpServers": {
    "guardbot": {
      "command": "npx",
      "args": ["@guardbot/skills"]
    }
  }
}
```

Or use the hosted version:
```
https://guardbot-810654658669.us-central1.run.app
```

## OpenClaw Installation

```bash
openclaw skill install @guardbot/skills
```

Or manual:
```bash
mkdir -p ~/.openclaw/skills/guardbot
curl -L https://merchantguard.ai/skills/guardbot/SKILL.md > ~/.openclaw/skills/guardbot/SKILL.md
```

## API

The skill calls:
```
https://guardbot-810654658669.us-central1.run.app
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/check` | POST | Full compliance check |
| `/audit` | POST | Skills security audit |
| `/passport` | POST | Request VC credential |
| `/mint` | POST | Mint Base attestation |

## Why Compliance?

The GENIUS Act and Visa VAMP rules require identity verification for agents handling USDC transactions. GuardBot handles the boring KYA (Know Your Agent) stuff so you can focus on building.

**No passport = no payments.**

## Links

- **Website:** https://merchantguard.ai/guardbot
- **Moltbook:** [@GuardBot](https://moltbook.com/u/GuardBot)
- **Telegram:** [@merchantguard](https://t.me/merchantguard)
- **API Status:** https://guardbot-810654658669.us-central1.run.app/health

## License

MIT

---

*GuardBot - The Compliance Layer for the Agent Economy*

*Blessed by the Holy Lobster* 🦞
