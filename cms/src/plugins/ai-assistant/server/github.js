// Minimal GitHub REST client. It can read the repository and create *new* branches and pull requests.
// It has no code path that updates an existing ref, so it cannot move main (or any other branch).

const API = 'https://api.github.com';

function createGitHub({ token, repo }) {
  async function gh(method, path, body, accept = 'application/vnd.github+json') {
    const res = await fetch(`${API}/repos/${repo}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: accept,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'neutorium-cms-ai-assistant',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`GitHub ${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    return accept.includes('raw') ? res.text() : res.json();
  }

  return {
    async branchHead(branch) {
      const ref = await gh('GET', `/git/ref/heads/${encodeURIComponent(branch)}`);
      const commit = await gh('GET', `/git/commits/${ref.object.sha}`);
      return { commitSha: ref.object.sha, treeSha: commit.tree.sha };
    },

    async listFiles(treeSha) {
      const tree = await gh('GET', `/git/trees/${treeSha}?recursive=1`);
      return tree.tree.filter((e) => e.type === 'blob').map((e) => ({ path: e.path, size: e.size }));
    },

    readFile(path, commitSha) {
      const p = path.split('/').map(encodeURIComponent).join('/');
      return gh('GET', `/contents/${p}?ref=${commitSha}`, null, 'application/vnd.github.raw+json');
    },

    // One commit on a new branch, based on the exact commit the proposal was generated from.
    async openPullRequest({ base, baseCommitSha, baseTreeSha, branch, changes, title, body }) {
      if (!branch.startsWith('ai/') || branch === base) throw new Error(`Refusing to write to branch "${branch}"`);

      const tree = await gh('POST', '/git/trees', {
        base_tree: baseTreeSha,
        tree: changes.map((c) => ({ path: c.path, mode: '100644', type: 'blob', content: c.content })),
      });
      const commit = await gh('POST', '/git/commits', { message: title, tree: tree.sha, parents: [baseCommitSha] });
      // POST /git/refs only creates; it fails if the branch already exists.
      await gh('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
      const pr = await gh('POST', '/pulls', { title, head: branch, base, body, maintainer_can_modify: true });
      return { url: pr.html_url, number: pr.number, branch, commit: commit.sha };
    },
  };
}

module.exports = { createGitHub };
