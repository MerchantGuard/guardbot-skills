#!/usr/bin/env node
/**
 * GuardBot MCP Server
 * Compliance passports for AI agents
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const GUARDBOT_API = 'https://guardbot-810654658669.us-central1.run.app';

// Tool definitions
const TOOLS = [
  {
    name: 'guardbot_score',
    description: 'Calculate your Agent-Ready Score (0-110) based on wallet history, social reputation, and code integrity. Returns trust tier and unlocked capabilities.',
    inputSchema: {
      type: 'object',
      properties: {
        wallet_address: {
          type: 'string',
          description: 'Your wallet address (0x...)'
        },
        agent_id: {
          type: 'string',
          description: 'Your Moltbook username or agent identifier'
        },
        industry: {
          type: 'string',
          description: 'Business industry (crypto, gaming, cbd, etc.)',
          default: 'general'
        }
      },
      required: ['wallet_address']
    }
  },
  {
    name: 'guardbot_audit',
    description: 'Security audit of your installed skills. Checks for sensitive path access, unsigned sources, malicious patterns, and prompt injection vulnerabilities.',
    inputSchema: {
      type: 'object',
      properties: {
        skills_directory: {
          type: 'string',
          description: 'Path to skills directory (default: ~/.openclaw/skills)',
          default: '~/.openclaw/skills'
        }
      }
    }
  },
  {
    name: 'guardbot_passport',
    description: 'Request a W3C Verifiable Credential compliance passport. Requires Agent-Ready Score >= 60.',
    inputSchema: {
      type: 'object',
      properties: {
        wallet_address: {
          type: 'string',
          description: 'Your wallet address'
        },
        agent_name: {
          type: 'string',
          description: 'Display name for your agent'
        }
      },
      required: ['wallet_address', 'agent_name']
    }
  },
  {
    name: 'guardbot_mint',
    description: 'Mint an on-chain attestation on Base L2. Creates permanent, verifiable record of compliance status. Cost: ~0.001 ETH gas.',
    inputSchema: {
      type: 'object',
      properties: {
        wallet_address: {
          type: 'string',
          description: 'Your wallet address'
        }
      },
      required: ['wallet_address']
    }
  },
  {
    name: 'guardbot_check',
    description: 'Quick compliance check - returns pass/fail for payment readiness without full scoring.',
    inputSchema: {
      type: 'object',
      properties: {
        wallet_address: {
          type: 'string',
          description: 'Wallet to check'
        }
      },
      required: ['wallet_address']
    }
  }
];

async function callGuardBotAPI(endpoint: string, data: any): Promise<any> {
  const response = await fetch(`${GUARDBOT_API}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`GuardBot API error: ${response.status}`);
  }

  return response.json();
}

async function handleTool(name: string, args: any): Promise<string> {
  switch (name) {
    case 'guardbot_score': {
      const result = await callGuardBotAPI('/check', {
        wallet_address: args.wallet_address,
        agent_id: args.agent_id || 'unknown',
        owner_industry: args.industry || 'general',
      });
      return JSON.stringify(result, null, 2);
    }

    case 'guardbot_audit': {
      const result = await callGuardBotAPI('/audit', {
        skills_directory: args.skills_directory || '~/.openclaw/skills',
      });
      return JSON.stringify(result, null, 2);
    }

    case 'guardbot_passport': {
      const result = await callGuardBotAPI('/passport', {
        wallet_address: args.wallet_address,
        agent_name: args.agent_name,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'guardbot_mint': {
      const result = await callGuardBotAPI('/mint', {
        wallet_address: args.wallet_address,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'guardbot_check': {
      const result = await callGuardBotAPI('/check', {
        wallet_address: args.wallet_address,
        quick_check: true,
      });
      return result.payment_ready
        ? `✅ PASS - Agent is payment-ready (Score: ${result.score})`
        : `❌ FAIL - Score ${result.score} below threshold. ${result.recommendation}`;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: 'guardbot',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, args || {});
    return {
      content: [{ type: 'text', text: result }],
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GuardBot MCP server running');
}

main().catch(console.error);
