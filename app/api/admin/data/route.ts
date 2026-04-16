import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'content', 'portfolio-data.json');

// ── Read always from local filesystem (works on Vercel — file is bundled) ─────
function readLocalData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// ── Write: GitHub API on Vercel, filesystem locally ───────────────────────────
async function writeData(data: any): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo  = process.env.GITHUB_REPO;   // e.g. "Rahul8811/Portfolio"
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'content/portfolio-data.json';

  if (token && repo) {
    // ── Production: commit via GitHub API ──────────────────────────────────
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // 1. Get current file SHA (required for update)
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!getRes.ok) {
      throw new Error(`GitHub GET failed: ${getRes.status} ${await getRes.text()}`);
    }
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 2. Push updated content
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'cms: update portfolio data',
        content,
        sha,
        branch,
      }),
    });
    if (!putRes.ok) {
      throw new Error(`GitHub PUT failed: ${putRes.status} ${await putRes.text()}`);
    }
  } else {
    // ── Local dev: write to filesystem ─────────────────────────────────────
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// GET /api/admin/data
export async function GET(_req: NextRequest) {
  try {
    const data = readLocalData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST /api/admin/data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await writeData(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Save error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save' }, { status: 500 });
  }
}
