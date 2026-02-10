/*  ============================================
    GitHub-based JSON Database for Static Sites
    ============================================
    Reads/writes JSON files in your GitHub repo
    via the GitHub Contents API. Each write = a commit.
    ============================================ */

const GH_DB = (function () {
  // ── CONFIGURATION ─────────────────────────────
  // IMPORTANT: After cloning, replace these with your own values.
  // Generate a fine-grained personal access token at:
  //   https://github.com/settings/tokens?type=beta
  // Give it ONLY "Contents: Read and write" permission on THIS repo.
  const CONFIG = {
    token: "",           // ← paste your GitHub PAT here
    owner: "Vatsal-Patel-09",
    repo: "chirag-jewellery",
    branch: "main",
  };

  function isConfigured() {
    return CONFIG.token.length > 0;
  }

  // Base URL helper
  function apiURL(filePath) {
    return `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`;
  }

  // Common headers
  function headers() {
    return {
      Authorization: `token ${CONFIG.token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  // ── READ a JSON file ──────────────────────────
  async function read(filePath) {
    if (!isConfigured()) {
      console.warn("GH_DB: No token configured – falling back to fetch.");
      // Fallback: just fetch the raw file (works for public repos, read-only)
      const res = await fetch(filePath + "?_=" + Date.now());
      const content = await res.json();
      return { content, sha: null };
    }

    const res = await fetch(apiURL(filePath), { headers: headers() });
    if (!res.ok) {
      if (res.status === 404) return { content: [], sha: null };
      throw new Error(`GH_DB read error: ${res.status}`);
    }
    const data = await res.json();
    const decoded = decodeURIComponent(
      atob(data.content)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return { content: JSON.parse(decoded), sha: data.sha };
  }

  // ── WRITE a JSON file (creates a commit) ──────
  async function write(filePath, content, sha, commitMsg) {
    if (!isConfigured()) {
      console.error("GH_DB: Cannot write – no token configured.");
      return null;
    }

    const encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify(content, null, 2)))
    );

    const body = {
      message: commitMsg || `Update ${filePath}`,
      content: encoded,
      branch: CONFIG.branch,
    };
    if (sha) body.sha = sha;

    const res = await fetch(apiURL(filePath), {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("GH_DB write error:", err);
      throw new Error(err.message || "Write failed");
    }
    return await res.json();
  }

  // ── PUBLIC API ────────────────────────────────
  return { read, write, isConfigured, CONFIG };
})();
