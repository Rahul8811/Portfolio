import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

async function uploadTechIcon(fileName: string, buffer: Buffer): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = `public/tech-icons/${fileName}`;

  if (token && repo) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

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
        message: `cms: add tech icon ${fileName}`,
        content,
        ...(sha ? { sha } : {}),
        branch,
      }),
    });
    if (!putRes.ok) {
      throw new Error(`GitHub PUT failed: ${putRes.status} ${await putRes.text()}`);
    }
    return `/tech-icons/${fileName}`;
  } else {
    const dir = path.join(process.cwd(), 'public', 'tech-icons');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const destPath = path.join(dir, fileName);
    fs.writeFileSync(destPath, buffer);
    return `/tech-icons/${fileName}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('icon') as File | null;
    const techId = formData.get('techId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!techId) {
      return NextResponse.json({ error: 'No techId provided' }, { status: 400 });
    }
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      return NextResponse.json({ error: 'File must be PNG, JPG, or SVG' }, { status: 400 });
    }

    const ext = file.type === 'image/svg+xml' ? 'svg' : file.type === 'image/png' ? 'png' : 'jpg';
    const fileName = `${techId}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadTechIcon(fileName, buffer);

    return NextResponse.json({ ok: true, url });
  } catch (err: any) {
    console.error('Tech icon upload error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upload' }, { status: 500 });
  }
}
