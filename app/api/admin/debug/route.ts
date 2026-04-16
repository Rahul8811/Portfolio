import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const repo  = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  // Test the GitHub API connection
  let githubTest = 'not tested';
  let details = '';

  if (token && repo) {
    try {
      const filePath = 'content/portfolio-data.json';
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch || 'main'}`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      });
      const body = await res.json();
      if (res.ok) {
        githubTest = 'SUCCESS ✅';
        details = `File SHA: ${body.sha?.slice(0, 8)}`;
      } else {
        githubTest = `FAILED ❌ - ${res.status}`;
        details = body.message || JSON.stringify(body);
      }
    } catch (e: any) {
      githubTest = `ERROR ❌`;
      details = e.message;
    }
  }

  return NextResponse.json({
    env: {
      GITHUB_TOKEN: token ? `set (${token.slice(0, 6)}...)` : 'MISSING ❌',
      GITHUB_REPO: repo || 'MISSING ❌',
      GITHUB_BRANCH: branch || '(defaults to main)',
    },
    githubApiTest: githubTest,
    details,
  });
}
