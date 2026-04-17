import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

async function writeResume(buffer: Buffer): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'public/resume.pdf';

  if (token && repo) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // Get existing file SHA if present (required for updates)
    let sha: string | undefined;
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    const content = buffer.toString('base64');
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'cms: update resume',
        content,
        ...(sha ? { sha } : {}),
        branch,
      }),
    });
    if (!putRes.ok) {
      throw new Error(`GitHub PUT failed: ${putRes.status} ${await putRes.text()}`);
    }
  } else {
    const destPath = path.join(process.cwd(), 'public', 'resume.pdf');
    fs.writeFileSync(destPath, buffer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeResume(buffer);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upload' }, { status: 500 });
  }
}
