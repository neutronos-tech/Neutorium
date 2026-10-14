import { useEffect, useState } from 'react';
import { Layouts, Page, useFetchClient } from '@strapi/strapi/admin';
import { Alert, Box, Button, Checkbox, Flex, Link, TextInput, Typography } from '@strapi/design-system';

const API = '/ai-assistant';
const errorText = (e) => e?.response?.data?.error?.message || e?.message || 'Something went wrong.';

function Diff({ text }) {
  const colour = (l) => (l.startsWith('+') ? 'rgba(40,160,80,0.15)' : l.startsWith('-') ? 'rgba(200,50,50,0.15)' : 'transparent');
  return (
    <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.5, overflowX: 'auto', fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>
      {text.split('\n').slice(4).map((l, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} style={{ padding: '0 12px', whiteSpace: 'pre', background: colour(l) }}>{l || ' '}</div>
      ))}
    </pre>
  );
}

export default function App() {
  const { get, post } = useFetchClient();
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [pr, setPr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await get(`${API}/status`);
        setStatus(data);
        if (data.githubReady) setFiles((await get(`${API}/files`)).data.files);
      } catch (e) {
        setError(errorText(e));
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try { await fn(); } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  };

  const doPreview = () => run(async () => {
    setPr(null);
    const { data } = await post(`${API}/preview`, { find, replace, files: selected });
    setPreview(data);
    setTitle(data.title);
  });

  const doApply = () => run(async () => {
    const { data } = await post(`${API}/apply`, { id: preview.id, title });
    setPr(data.pr);
  });

  if (!status && !error) return <Page.Loading />;

  return (
    <Page.Main>
      <Page.Title>Assistant</Page.Title>
      <Layouts.Header title="Assistant" subtitle="Change text on the website: a date, a name, a sentence. You review the change, then it goes to GitHub as a pull request." />
      <Layouts.Content>
        <Flex direction="column" alignItems="stretch" gap={4}>
          {error && <Alert variant="danger" title="Error" closeLabel="Close" onClose={() => setError('')}>{error}</Alert>}
          {status && !status.githubReady && (
            <Alert variant="warning" title="Not connected to GitHub" closeLabel="Close" onClose={() => {}}>Set AI_GITHUB_TOKEN on the server (see cms/README.md).</Alert>
          )}

          <Box background="neutral0" padding={6} hasRadius shadow="tableShadow">
            <Flex direction="column" alignItems="stretch" gap={4}>
              <Typography variant="pi" fontWeight="bold">Find (exact text)</Typography>
              <TextInput aria-label="Find" placeholder="© 2025" value={find} onChange={(e) => setFind(e.target.value)} />
              <Typography variant="pi" fontWeight="bold">Replace with</Typography>
              <TextInput aria-label="Replace with" placeholder="© 2026" value={replace} onChange={(e) => setReplace(e.target.value)} />
              <Box>
                <Button variant="ghost" size="S" onClick={() => setShowFiles(!showFiles)}>
                  {selected.length ? `In ${selected.length} selected file(s)` : 'In all website files'} · choose files
                </Button>
                {showFiles && (
                  <Box paddingTop={2} style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {files.map((f) => (
                      <Box key={f} paddingBottom={1}>
                        <Checkbox checked={selected.includes(f)} onCheckedChange={() => setSelected((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]))}>
                          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{f}</span>
                        </Checkbox>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Flex justifyContent="flex-end">
                <Button onClick={doPreview} loading={busy} disabled={busy || !find || !status?.githubReady}>Preview change</Button>
              </Flex>
            </Flex>
          </Box>

          {preview && (
            <Box background="neutral0" padding={6} hasRadius shadow="tableShadow">
              {preview.changes.length === 0 ? (
                <Typography>That text was not found{selected.length ? ' in the selected files' : ''}. It must match exactly, including capitals.</Typography>
              ) : (
                <Flex direction="column" alignItems="stretch" gap={4}>
                  <Typography variant="delta" tag="h2">Review ({preview.changes.length} file{preview.changes.length > 1 ? 's' : ''}, main @ {preview.commit})</Typography>
                  {preview.changes.map((c) => (
                    <Box key={c.path} borderColor="neutral200" hasRadius>
                      <Box padding={2}><Typography fontWeight="bold" style={{ fontFamily: 'monospace' }}>{c.path}</Typography> <Typography variant="pi">({c.count}×)</Typography></Box>
                      <Diff text={c.diff} />
                    </Box>
                  ))}
                  {pr ? (
                    <Alert variant="success" title="Pull request opened" closeLabel="Close" onClose={() => {}}>
                      <Link href={pr.url} isExternal>Open #{pr.number} on GitHub</Link>. Merge it there to publish.
                    </Alert>
                  ) : (
                    <Flex gap={2}>
                      <Box style={{ flex: 1 }}><TextInput aria-label="Pull request title" value={title} onChange={(e) => setTitle(e.target.value)} /></Box>
                      <Button onClick={doApply} loading={busy} disabled={busy}>Open pull request</Button>
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>
          )}
        </Flex>
      </Layouts.Content>
    </Page.Main>
  );
}
